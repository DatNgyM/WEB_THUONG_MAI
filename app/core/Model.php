<?php
/**
 * Base Model Class
 * Provides base functionality for all models
 */
class Model
{
    protected $db;
    protected $table;
    protected $primaryKey = 'id';

    public function __construct()
    {
        $this->db = new Database();
    }

    /**
     * Get all records
     * @return array
     */
    public function getAll()
    {
        $this->db->query("SELECT * FROM {$this->table}");
        return $this->db->resultSet();
    }

    /**
     * Get single record by ID
     * @param int $id ID to get record by
     * @return object
     */
    public function getById($id)
    {
        $this->db->query("SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    /**
     * Get records by column and value
     * @param string $column Column name
     * @param mixed $value Value to match
     * @return array
     */
    public function getBy($column, $value)
    {
        $this->db->query("SELECT * FROM {$this->table} WHERE {$column} = :value");
        $this->db->bind(':value', $value);
        return $this->db->resultSet();
    }

    /**
     * Insert record
     * @param array $data Data to insert
     * @return bool
     */
    public function insert($data)
    {
        // Prepare column names and value placeholders
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));

        $this->db->query("INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})");

        // Bind values
        foreach ($data as $key => $value) {
            $this->db->bind(':' . $key, $value);
        }

        // Execute
        if ($this->db->execute()) {
            return $this->db->lastInsertId();
        } else {
            return false;
        }
    }

    /**
     * Update record
     * @param array $data Data to update
     * @param int $id ID of record to update
     * @return bool
     */
    public function update($data, $id)
    {
        // Prepare column names and value placeholders
        $setPart = '';
        foreach ($data as $key => $value) {
            $setPart .= "{$key} = :{$key}, ";
        }
        $setPart = rtrim($setPart, ', ');

        $this->db->query("UPDATE {$this->table} SET {$setPart} WHERE {$this->primaryKey} = :id");

        // Bind values
        foreach ($data as $key => $value) {
            $this->db->bind(':' . $key, $value);
        }
        $this->db->bind(':id', $id);

        // Execute
        return $this->db->execute();
    }

    /**
     * Delete record
     * @param int $id ID of record to delete
     * @return bool
     */
    public function delete($id)
    {
        $this->db->query("DELETE FROM {$this->table} WHERE {$this->primaryKey} = :id");
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }

    /**
     * Custom query
     * @param string $sql SQL query
     * @param array $params Parameters to bind
     * @return array
     */
    public function customQuery($sql, $params = [])
    {
        $this->db->query($sql);

        foreach ($params as $key => $value) {
            $this->db->bind($key, $value);
        }

        return $this->db->resultSet();
    }
}
