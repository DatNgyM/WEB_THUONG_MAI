#!/usr/bin/env node

/**
 * CCCD Migration Utility
 * 
 * This script provides command-line tools for managing CCCD values in the database.
 * It can be used to list, update, and verify CCCD values.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Database connection configuration
// Update these values to match your environment
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'webthuongmai',
  password: 'password',
  port: 5432,
};

const pool = new Pool(dbConfig);

// Create readline interface for CLI interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main function to parse and handle commands
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch(command) {
      case 'list':
        await listUsers(args[1]);
        break;
      case 'update':
        if (args.length < 3) {
          console.error('Usage: cccd-util update <userId> <newCccd>');
          process.exit(1);
        }
        await updateCccd(args[1], args[2]);
        break;
      case 'fix-temporary':
        await fixTemporaryCccds();
        break;
      case 'verify':
        await verifyCccds();
        break;
      case 'stats':
        await showStats();
        break;
      case 'backup':
        await backupCccds();
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
    rl.close();
  }
}

// List users based on filter criteria
async function listUsers(filter) {
  let query = `
    SELECT id, name, username, email, cccd, created_at 
    FROM users 
  `;
  
  const params = [];
  
  if (filter === 'temporary') {
    query += `WHERE cccd LIKE 'T%'`;
  } else if (filter === 'valid') {
    query += `WHERE cccd ~ '^[0-9]{12}$'`;
  } else if (filter === 'invalid') {
    query += `WHERE cccd IS NULL OR (cccd !~ '^[0-9]{12}$' AND cccd NOT LIKE 'T%')`;
  }
  
  query += ` ORDER BY id`;
  
  const result = await pool.query(query, params);
  
  console.log(`\nFound ${result.rows.length} users:`);
  console.log('------------------------------------------------------');
  console.log('ID  | Name              | Username       | CCCD            ');
  console.log('------------------------------------------------------');
  
  result.rows.forEach(user => {
    console.log(
      `${user.id.toString().padEnd(4)} | ` +
      `${user.name.substring(0, 16).padEnd(17)} | ` +
      `${user.username.substring(0, 14).padEnd(14)} | ` +
      `${user.cccd || 'NULL'}`
    );
  });
  
  console.log('------------------------------------------------------');
}

// Update CCCD for a specific user
async function updateCccd(userId, newCccd) {
  // Validate CCCD format
  if (newCccd !== 'NULL' && !/^\d{12}$/.test(newCccd)) {
    console.error('Error: CCCD must be exactly 12 digits or NULL');
    return;
  }
  
  // Get current user info
  const userResult = await pool.query('SELECT id, name, username, cccd FROM users WHERE id = $1', [userId]);
  
  if (userResult.rows.length === 0) {
    console.error(`Error: User with ID ${userId} not found`);
    return;
  }
  
  const user = userResult.rows[0];
  console.log(`\nUser found: ${user.name} (${user.username})`);
  console.log(`Current CCCD: ${user.cccd || 'NULL'}`);
  console.log(`New CCCD: ${newCccd === 'NULL' ? 'NULL' : newCccd}`);
  
  // Confirm the update
  rl.question('\nAre you sure you want to update this CCCD? (y/n): ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      try {
        const updateResult = await pool.query(
          'UPDATE users SET cccd = $1 WHERE id = $2 RETURNING *',
          [newCccd === 'NULL' ? null : newCccd, userId]
        );
        
        console.log(`\nSuccessfully updated CCCD for user ${updateResult.rows[0].username}`);
      } catch (err) {
        console.error('Error updating CCCD:', err.message);
      }
    } else {
      console.log('Update cancelled');
    }
    rl.close();
  });
}

// Fix all temporary CCCDs (interactive)
async function fixTemporaryCccds() {
  const tempUsers = await pool.query("SELECT id, name, username, cccd FROM users WHERE cccd LIKE 'T%'");
  
  if (tempUsers.rows.length === 0) {
    console.log('No users with temporary CCCDs found');
    return;
  }
  
  console.log(`\nFound ${tempUsers.rows.length} users with temporary CCCDs:`);
  tempUsers.rows.forEach((user, index) => {
    console.log(`${index+1}. ${user.name} (${user.username}) - ${user.cccd}`);
  });
  
  console.log('\nOptions:');
  console.log('1. Generate new valid CCCDs for all users');
  console.log('2. Remove CCCD values (set to NULL)');
  console.log('3. Update individual users');
  console.log('4. Exit without changes');
  
  rl.question('\nSelect an option (1-4): ', async (answer) => {
    switch(answer) {
      case '1':
        await generateValidCccds(tempUsers.rows);
        break;
      case '2':
        await removeTemporaryCccds(tempUsers.rows);
        break;
      case '3':
        await updateIndividualCccds(tempUsers.rows);
        break;
      case '4':
      default:
        console.log('No changes made');
        rl.close();
        break;
    }
  });
}

// Generate valid CCCDs for users
async function generateValidCccds(users) {
  console.log('\nGenerating valid CCCDs for users...');
  
  for (const user of users) {
    // Generate a random 12-digit number
    const newCccd = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    
    try {
      await pool.query('UPDATE users SET cccd = $1 WHERE id = $2', [newCccd, user.id]);
      console.log(`Updated ${user.username}: ${user.cccd} -> ${newCccd}`);
    } catch (err) {
      console.error(`Error updating ${user.username}:`, err.message);
    }
  }
  
  console.log('\nAll temporary CCCDs have been replaced with valid CCCDs');
  rl.close();
}

// Remove temporary CCCDs (set to NULL)
async function removeTemporaryCccds(users) {
  console.log('\nRemoving temporary CCCDs...');
  
  for (const user of users) {
    try {
      await pool.query('UPDATE users SET cccd = NULL WHERE id = $1', [user.id]);
      console.log(`Updated ${user.username}: ${user.cccd} -> NULL`);
    } catch (err) {
      console.error(`Error updating ${user.username}:`, err.message);
    }
  }
  
  console.log('\nAll temporary CCCDs have been removed');
  rl.close();
}

// Update individual CCCDs (interactive)
async function updateIndividualCccds(users) {
  // This is an interactive function to update CCCDs one by one
  // Implementation left as an exercise
  console.log('This feature is not yet implemented');
  rl.close();
}

// Verify all CCCDs in the database
async function verifyCccds() {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN cccd LIKE 'T%' THEN 1 END) as temporary,
      COUNT(CASE WHEN cccd ~ '^[0-9]{12}$' THEN 1 END) as valid,
      COUNT(CASE WHEN cccd IS NULL THEN 1 END) as null_cccd,
      COUNT(CASE WHEN cccd IS NOT NULL AND cccd NOT LIKE 'T%' AND cccd !~ '^[0-9]{12}$' THEN 1 END) as invalid
    FROM users
  `);
  
  const stats = result.rows[0];
  
  console.log('\nCCCD Verification Results:');
  console.log('------------------------------------------');
  console.log(`Total users: ${stats.total}`);
  console.log(`Valid CCCDs: ${stats.valid} (${(stats.valid / stats.total * 100).toFixed(2)}%)`);
  console.log(`Temporary CCCDs: ${stats.temporary} (${(stats.temporary / stats.total * 100).toFixed(2)}%)`);
  console.log(`NULL CCCDs: ${stats.null_cccd} (${(stats.null_cccd / stats.total * 100).toFixed(2)}%)`);
  console.log(`Invalid format CCCDs: ${stats.invalid} (${(stats.invalid / stats.total * 100).toFixed(2)}%)`);
  
  // Check for duplicate CCCDs
  const duplicates = await pool.query(`
    SELECT cccd, COUNT(*) as count
    FROM users
    WHERE cccd IS NOT NULL
    GROUP BY cccd
    HAVING COUNT(*) > 1
  `);
  
  if (duplicates.rows.length > 0) {
    console.log('\nWARNING: Found duplicate CCCDs:');
    duplicates.rows.forEach(dup => {
      console.log(`CCCD: ${dup.cccd} - Used ${dup.count} times`);
    });
  } else {
    console.log('\nNo duplicate CCCDs found.');
  }
}

// Show statistics about CCCD distribution
async function showStats() {
  // Similar to verify but with more detailed stats
  await verifyCccds();
  
  // Additional statistics
  const monthlyStats = await pool.query(`
    SELECT 
      TO_CHAR(created_at, 'YYYY-MM') as month,
      COUNT(*) as total_users,
      COUNT(CASE WHEN cccd LIKE 'T%' THEN 1 END) as temp_cccd,
      COUNT(CASE WHEN cccd ~ '^[0-9]{12}$' THEN 1 END) as valid_cccd
    FROM users
    GROUP BY TO_CHAR(created_at, 'YYYY-MM')
    ORDER BY month
  `);
  
  console.log('\nMonthly Registration Statistics:');
  console.log('------------------------------------------');
  console.log('Month     | Total | Valid CCCD | Temp CCCD');
  console.log('------------------------------------------');
  
  monthlyStats.rows.forEach(month => {
    console.log(
      `${month.month} | ` +
      `${month.total_users.toString().padEnd(5)} | ` +
      `${month.valid_cccd.toString().padEnd(10)} | ` +
      `${month.temp_cccd}`
    );
  });
}

// Backup all CCCD data to a CSV file
async function backupCccds() {
  const result = await pool.query('SELECT id, name, username, email, cccd FROM users ORDER BY id');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(__dirname, `cccd_backup_${timestamp}.csv`);
  
  const header = 'id,name,username,email,cccd\n';
  let csvContent = header;
  
  result.rows.forEach(user => {
    csvContent += `${user.id},"${user.name}","${user.username}","${user.email}","${user.cccd || ''}"\n`;
  });
  
  fs.writeFileSync(filename, csvContent);
  console.log(`Backup created: ${filename}`);
}

// Show help text
function showHelp() {
  console.log(`
CCCD Management Utility

Usage:
  cccd-util <command> [options]

Commands:
  list [filter]      List users, optional filter: temporary, valid, invalid
  update <id> <cccd> Update a user's CCCD (use 'NULL' for null value)
  fix-temporary      Interactive menu to fix temporary CCCDs
  verify             Verify CCCD distribution and check for issues
  stats              Show statistics about CCCD distribution
  backup             Backup all CCCD data to a CSV file
  help               Show this help text

Examples:
  cccd-util list temporary     List all users with temporary CCCDs
  cccd-util update 1 123456789012  Update user ID 1's CCCD
  cccd-util verify             Check CCCD validity across the database
  `);
}

// Run the program
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
