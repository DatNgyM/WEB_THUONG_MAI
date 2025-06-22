<?php
/**
 * Database Core Class
 * Xử lý kết nối và truy vấn MySQL Database
 */
class Database
{
    private $host = DB_HOST;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $dbname = DB_NAME;
    private $charset = DB_CHARSET;
    private $port = DB_PORT;

    private $dbh; // Database Handler
    private $stmt; // Statement
    private $error;

    /**
     * Constructor - Khởi tạo kết nối database
     */
    public function __construct()
    {
        // Tạo DSN (Data Source Name)
        $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->dbname};charset={$this->charset}";

        try {
            // Tạo PDO instance
            $this->dbh = new PDO($dsn, $this->user, $this->pass, DB_OPTIONS);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            echo "Database Connection Error: " . $this->error;
            die();
        }
    }

    /**
     * Chuẩn bị truy vấn SQL
     * @param string $sql
     */
    public function query($sql)
    {
        $this->stmt = $this->dbh->prepare($sql);
    }

    /**
     * Bind parameters với prepared statement
     * @param string $param
     * @param mixed $value
     * @param int $type
     */
    public function bind($param, $value, $type = null)
    {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }

    /**
     * Thực thi prepared statement
     * @return bool
     */
    public function execute()
    {
        try {
            return $this->stmt->execute();
        } catch (PDOException $e) {
            echo "Query Error: " . $e->getMessage();
            return false;
        }
    }

    /**
     * Lấy nhiều dòng kết quả
     * @return array
     */
    public function resultSet()
    {
        $this->execute();
        return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Lấy một dòng kết quả
     * @return array
     */
    public function single()
    {
        $this->execute();
        return $this->stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Đếm số dòng kết quả
     * @return int
     */
    public function rowCount()
    {
        return $this->stmt->rowCount();
    }

    /**
     * Lấy ID cuối cùng được insert
     * @return int
     */
    public function lastInsertId()
    {
        return $this->dbh->lastInsertId();
    }

    /**
     * Bắt đầu transaction
     */
    public function beginTransaction()
    {
        return $this->dbh->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit()
    {
        return $this->dbh->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback()
    {
        return $this->dbh->rollback();
    }

    /**
     * Đóng kết nối database
     */
    public function close()
    {
        $this->dbh = null;
    }

    /**
     * Kiểm tra kết nối database
     * @return bool
     */
    public function isConnected()
    {
        return $this->dbh !== null;
    }

    /**
     * Debug query với parameters
     */
    public function debugDumpParams()
    {
        if ($this->stmt) {
            $this->stmt->debugDumpParams();
        }
    }

    /**
     * Thực thi truy vấn đơn giản (không prepared)
     * @param string $sql
     * @return mixed
     */
    public function exec($sql)
    {
        try {
            return $this->dbh->exec($sql);
        } catch (PDOException $e) {
            echo "Exec Error: " . $e->getMessage();
            return false;
        }
    }

    /**
     * Lấy thông tin database
     * @return array
     */
    public function getDatabaseInfo()
    {
        return [
            'host' => $this->host,
            'database' => $this->dbname,
            'charset' => $this->charset,
            'port' => $this->port,
            'connected' => $this->isConnected()
        ];
    }
}
