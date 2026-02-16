import { useState } from "react";
import { ChevronRight, ChevronDown, Book, Search, ExternalLink } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  content: string;
  examples?: string[];
  subtopics?: Topic[];
}

const sqlGuideData: Topic[] = [
  {
    id: "intro",
    title: "1. Introduction to SQL",
    content: "SQL (Structured Query Language) is the foundation of data management in modern enterprises. From startups to Fortune 500 companies, SQL powers mission-critical applications, analytics platforms, and AI systems processing billions of transactions daily.",
    subtopics: [
      {
        id: "what-is-sql",
        title: "What is SQL?",
        content: "SQL is a declarative, domain-specific language designed for managing relational databases. Developed at IBM in the 1970s by Donald Chamberlin and Raymond Boyce, it has evolved into the industry standard for data manipulation, querying, and administration across all major database systems.",
      },
      {
        id: "why-sql",
        title: "Why SQL in Modern Industry?",
        content: "SQL remains irreplaceable in 2024+ because: (1) It's the lingua franca of data - every data professional must know it. (2) 80% of the world's structured data lives in relational databases. (3) Modern extensions support JSON, arrays, graph data, and ML models. (4) Cloud platforms (AWS, Azure, GCP) are built on SQL foundations. (5) Average SQL developer salary: $95K-$150K USD.",
      },
      {
        id: "sql-evolution",
        title: "Evolution: SQL-86 to Modern SQL",
        content: "SQL-86/89: Basic querying. SQL-92: Transactions, joins. SQL:1999: Triggers, recursive queries. SQL:2003: Window functions, XML. SQL:2011: Temporal data. SQL:2016: JSON, pattern matching. SQL:2023: Property graphs, polymorphic tables. Each iteration added enterprise capabilities while maintaining backward compatibility.",
      },
      {
        id: "rdbms-landscape",
        title: "Database Landscape 2024",
        content: "PostgreSQL: Open-source leader, advanced features, AI/ML extensions. MySQL: Web applications, high performance. Oracle: Enterprise, mission-critical systems. SQL Server: Microsoft ecosystem, .NET integration. SQLite: Embedded, mobile apps. Cloud-native: Snowflake, BigQuery, Redshift, Aurora. NewSQL: CockroachDB, TiDB (distributed ACID).",
      },
    ],
  },
  {
    id: "fundamentals",
    title: "2. SQL Fundamentals",
    content: "Master the core concepts that form the foundation of all database work.",
    subtopics: [
      {
        id: "relational-model",
        title: "Relational Model & ACID",
        content: "Dr. E.F. Codd's relational model (1970) organizes data in tables with rows and columns. ACID guarantees: Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent transactions don't interfere), Durability (committed data survives failures). Critical for banking, e-commerce, healthcare.",
        examples: [
          "-- Transaction example\nBEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT; -- Both succeed or both fail",
        ],
      },
      {
        id: "data-types-deep",
        title: "Data Types: Complete Reference",
        content: "Numeric: TINYINT, SMALLINT, INT, BIGINT, DECIMAL(p,s), NUMERIC, FLOAT, DOUBLE. String: CHAR(n), VARCHAR(n), TEXT, CLOB. Binary: BINARY, VARBINARY, BLOB. Date/Time: DATE, TIME, TIMESTAMP, INTERVAL. Boolean: BOOLEAN. Special: UUID, JSON, JSONB, XML, ARRAY, HSTORE, ENUM, GEOMETRY, VECTOR (AI embeddings).",
        examples: [
          "CREATE TABLE products (\n  id BIGSERIAL PRIMARY KEY,\n  sku VARCHAR(50) UNIQUE NOT NULL,\n  price DECIMAL(10,2) CHECK (price >= 0),\n  metadata JSONB,\n  embedding VECTOR(1536), -- AI embeddings\n  tags TEXT[],\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);",
        ],
      },
      {
        id: "constraints-deep",
        title: "Constraints & Data Integrity",
        content: "NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT, EXCLUSION. Naming convention: pk_table, fk_table_ref, uk_table_column, ck_table_condition. Use DEFERRABLE for complex transaction scenarios.",
        examples: [
          "CREATE TABLE orders (\n  id BIGSERIAL PRIMARY KEY,\n  user_id BIGINT NOT NULL,\n  status VARCHAR(20) DEFAULT 'pending',\n  total DECIMAL(10,2) CHECK (total >= 0),\n  CONSTRAINT fk_orders_users \n    FOREIGN KEY (user_id) REFERENCES users(id)\n    ON DELETE CASCADE ON UPDATE CASCADE,\n  CONSTRAINT ck_orders_status \n    CHECK (status IN ('pending','processing','shipped','delivered','cancelled'))\n);",
        ],
      },
      {
        id: "normalization",
        title: "Database Normalization (1NF to 6NF)",
        content: "1NF: Atomic values, no repeating groups. 2NF: 1NF + no partial dependencies. 3NF: 2NF + no transitive dependencies. BCNF: 3NF + every determinant is a candidate key. 4NF: BCNF + no multi-valued dependencies. 5NF: 4NF + no join dependencies. 6NF: Temporal data normalization. Industry standard: 3NF for OLTP, denormalized for OLAP/analytics.",
      },
      {
        id: "indexes-fundamentals",
        title: "Indexing Strategies",
        content: "B-Tree: Default, range queries, sorting. Hash: Exact matches only. GiST/GIN: Full-text search, JSON, arrays. BRIN: Very large tables, correlated data. Partial: Filtered index for subset. Expression: Index on computed values. Covering: Include non-key columns. Clustered vs Non-clustered.",
        examples: [
          "-- Composite index for common query pattern\nCREATE INDEX idx_orders_user_date \n  ON orders(user_id, created_at DESC);\n\n-- Partial index for active records\nCREATE INDEX idx_active_users \n  ON users(email) WHERE status = 'active';\n\n-- Expression index\nCREATE INDEX idx_email_lower \n  ON users(LOWER(email));",
        ],
      },
    ],
  },
  {
    id: "querying-mastery",
    title: "3. Query Mastery",
    content: "Advanced querying techniques used in production systems.",
    subtopics: [
      {
        id: "select-advanced",
        title: "Advanced SELECT Techniques",
        content: "DISTINCT ON, LATERAL joins, table sampling, set operations (UNION, INTERSECT, EXCEPT), VALUES clauses, recursive CTEs, materialized CTEs.",
        examples: [
          "-- Get latest order per customer\nSELECT DISTINCT ON (customer_id) \n  customer_id, order_id, total, created_at\nFROM orders\nORDER BY customer_id, created_at DESC;\n\n-- Recursive CTE for hierarchical data\nWITH RECURSIVE org_tree AS (\n  SELECT id, name, manager_id, 1 as level\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, ot.level + 1\n  FROM employees e\n  JOIN org_tree ot ON e.manager_id = ot.id\n)\nSELECT * FROM org_tree ORDER BY level;",
        ],
      },
      {
        id: "joins-deep",
        title: "JOIN Optimization & Patterns",
        content: "Understanding join algorithms: Nested Loop (small tables), Hash Join (large tables, equality), Merge Join (sorted data). LATERAL joins for dependent subqueries. CROSS JOIN LATERAL for array unnesting. Anti-joins with NOT EXISTS. Semi-joins with EXISTS.",
        examples: [
          "-- LATERAL join (row-dependent subquery)\nSELECT c.name, recent.order_date, recent.total\nFROM customers c\nLEFT JOIN LATERAL (\n  SELECT order_date, total\n  FROM orders o\n  WHERE o.customer_id = c.id\n  ORDER BY order_date DESC\n  LIMIT 3\n) recent ON true;\n\n-- Anti-join: Customers with no orders\nSELECT c.*\nFROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.id\n);",
        ],
      },
      {
        id: "window-functions-deep",
        title: "Window Functions: Analytics Powerhouse",
        content: "ROW_NUMBER, RANK, DENSE_RANK, NTILE, LEAD, LAG, FIRST_VALUE, LAST_VALUE, NTH_VALUE. PARTITION BY for grouping. ORDER BY for sequence. Frame clauses: ROWS BETWEEN, RANGE BETWEEN. Running totals, moving averages, percentiles.",
        examples: [
          "-- Running total and moving average\nSELECT \n  date,\n  revenue,\n  SUM(revenue) OVER (ORDER BY date) as running_total,\n  AVG(revenue) OVER (\n    ORDER BY date \n    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) as moving_avg_7day,\n  RANK() OVER (ORDER BY revenue DESC) as revenue_rank\nFROM daily_sales;\n\n-- YoY comparison\nSELECT \n  date,\n  revenue,\n  LAG(revenue, 365) OVER (ORDER BY date) as revenue_last_year,\n  revenue - LAG(revenue, 365) OVER (ORDER BY date) as yoy_change\nFROM daily_sales;",
        ],
      },
      {
        id: "aggregates-advanced",
        title: "Advanced Aggregations",
        content: "FILTER clause, GROUPING SETS, ROLLUP, CUBE for multi-dimensional analysis. String aggregation: STRING_AGG, ARRAY_AGG. Statistical functions: STDDEV, VARIANCE, PERCENTILE_CONT, PERCENTILE_DISC, CORR, REGR_SLOPE.",
        examples: [
          "-- Conditional aggregation\nSELECT \n  department,\n  COUNT(*) FILTER (WHERE salary > 70000) as high_earners,\n  COUNT(*) FILTER (WHERE salary <= 70000) as regular_earners,\n  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) as median_salary\nFROM employees\nGROUP BY department;\n\n-- Multi-dimensional analysis\nSELECT \n  region, \n  product_category,\n  SUM(sales) as total_sales\nFROM sales_data\nGROUP BY GROUPING SETS (\n  (region, product_category),\n  (region),\n  (product_category),\n  ()\n);",
        ],
      },
    ],
  },
  {
    id: "performance",
    title: "4. Performance Optimization",
    content: "Production-grade performance tuning for high-scale systems.",
    subtopics: [
      {
        id: "query-optimization",
        title: "Query Optimization Techniques",
        content: "EXPLAIN ANALYZE for execution plans. Seq Scan vs Index Scan. Avoid SELECT *, use column pruning. Push predicates down. Minimize subqueries in WHERE. Use CTEs for readability but watch for optimization fences. Avoid functions on indexed columns in WHERE. Batch operations. Connection pooling.",
        examples: [
          "-- Bad: Function on indexed column\nSELECT * FROM users WHERE LOWER(email) = 'john@example.com';\n\n-- Good: Use expression index or compare as-is\nCREATE INDEX idx_email_lower ON users(LOWER(email));\n-- Or store emails in lowercase\n\n-- Batch inserts (10-100x faster)\nINSERT INTO users (name, email) VALUES\n  ('User 1', 'user1@example.com'),\n  ('User 2', 'user2@example.com'),\n  -- ... up to 1000 rows per batch\n  ('User N', 'userN@example.com');",
        ],
      },
      {
        id: "partitioning",
        title: "Table Partitioning Strategies",
        content: "Range partitioning (by date/ID), List partitioning (by category), Hash partitioning (distribute load). Benefits: Query performance, maintenance operations, parallel processing. Partition pruning reduces scan scope. Attach/detach partitions for data archival.",
        examples: [
          "-- Range partition by date\nCREATE TABLE events (\n  id BIGSERIAL,\n  event_type VARCHAR(50),\n  created_at TIMESTAMP NOT NULL,\n  data JSONB\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE events_2024_01 \n  PARTITION OF events\n  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');\n\nCREATE TABLE events_2024_02 \n  PARTITION OF events\n  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');",
        ],
      },
      {
        id: "materialized-views",
        title: "Materialized Views & Caching",
        content: "Pre-compute expensive queries. REFRESH MATERIALIZED VIEW updates data. CONCURRENTLY option allows queries during refresh. Use for dashboards, reports, complex aggregations. Incremental refresh strategies.",
        examples: [
          "-- Expensive aggregation\nCREATE MATERIALIZED VIEW sales_summary AS\nSELECT \n  DATE_TRUNC('day', order_date) as date,\n  product_id,\n  COUNT(*) as order_count,\n  SUM(total) as revenue,\n  AVG(total) as avg_order_value\nFROM orders\nGROUP BY 1, 2;\n\nCREATE INDEX idx_sales_summary_date ON sales_summary(date);\n\n-- Refresh (run nightly)\nREFRESH MATERIALIZED VIEW CONCURRENTLY sales_summary;",
        ],
      },
      {
        id: "sharding",
        title: "Database Sharding",
        content: "Horizontal partitioning across multiple databases. Shard key selection critical: user_id, tenant_id, geography. Hash-based vs range-based sharding. Challenges: joins across shards, distributed transactions, rebalancing. Tools: Vitess (MySQL), Citus (PostgreSQL).",
      },
      {
        id: "caching-strategies",
        title: "Multi-Layer Caching",
        content: "L1: Application cache (Redis, Memcached). L2: Query result cache. L3: Database buffer cache. Cache invalidation patterns: TTL, write-through, write-behind, event-based. Cache warming. Thundering herd prevention.",
      },
    ],
  },
  {
    id: "modern-sql",
    title: "5. Modern SQL Features",
    content: "Cutting-edge SQL capabilities introduced in recent standards.",
    subtopics: [
      {
        id: "json-operations",
        title: "JSON & Semi-Structured Data",
        content: "JSON vs JSONB (binary, indexable). Operators: ->, ->>, #>, #>>. Functions: jsonb_set, jsonb_insert, jsonb_array_elements, jsonb_each. GIN indexes for fast JSON queries. JSON path queries. Use cases: flexible schemas, event logging, API responses.",
        examples: [
          "-- JSON storage and querying\nCREATE TABLE products (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255),\n  attributes JSONB\n);\n\nCREATE INDEX idx_product_attrs ON products USING GIN (attributes);\n\nINSERT INTO products VALUES\n  (1, 'Laptop', '{\"brand\": \"Dell\", \"ram\": 16, \"tags\": [\"gaming\", \"portable\"]}');\n\n-- Query JSON fields\nSELECT * FROM products \nWHERE attributes->>'brand' = 'Dell'\n  AND (attributes->'ram')::int >= 16;\n\n-- Array contains\nSELECT * FROM products\nWHERE attributes->'tags' @> '[\"gaming\"]';",
        ],
      },
      {
        id: "full-text-search",
        title: "Full-Text Search",
        content: "tsvector and tsquery types. Ranking with ts_rank. Language support. Stemming and stop words. Phrase search. Fuzzy matching with pg_trgm. GIN/GiST indexes. Alternative to Elasticsearch for simple use cases.",
        examples: [
          "-- Full-text search setup\nALTER TABLE articles ADD COLUMN search_vector tsvector;\n\nUPDATE articles SET search_vector = \n  to_tsvector('english', title || ' ' || content);\n\nCREATE INDEX idx_articles_search \n  ON articles USING GIN(search_vector);\n\n-- Search query\nSELECT \n  title,\n  ts_rank(search_vector, query) as rank\nFROM articles, \n  to_tsquery('english', 'database & performance') query\nWHERE search_vector @@ query\nORDER BY rank DESC;",
        ],
      },
      {
        id: "temporal-data",
        title: "Temporal Tables & Time Travel",
        content: "System-versioned temporal tables. Track historical changes automatically. AS OF queries for point-in-time analysis. Compliance and audit trails. Bi-temporal data: transaction time + valid time.",
        examples: [
          "-- Temporal table (SQL:2011 standard)\nCREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  salary DECIMAL(10,2),\n  sys_start TIMESTAMP GENERATED ALWAYS AS ROW START,\n  sys_end TIMESTAMP GENERATED ALWAYS AS ROW END,\n  PERIOD FOR SYSTEM_TIME (sys_start, sys_end)\n) WITH SYSTEM VERSIONING;\n\n-- Query historical data\nSELECT * FROM employees \nFOR SYSTEM_TIME AS OF TIMESTAMP '2024-01-01 00:00:00'\nWHERE id = 123;",
        ],
      },
      {
        id: "graph-queries",
        title: "Graph Queries in SQL",
        content: "SQL:2023 Property Graph Queries. MATCH clauses for pattern matching. Shortest path algorithms. Use cases: social networks, fraud detection, recommendation engines. Alternatives: Neo4j, Amazon Neptune.",
        examples: [
          "-- Recursive query for graph traversal\nWITH RECURSIVE friends_network AS (\n  SELECT user_id, friend_id, 1 as degree\n  FROM friendships\n  WHERE user_id = 123\n  UNION\n  SELECT f.user_id, f.friend_id, fn.degree + 1\n  FROM friendships f\n  JOIN friends_network fn ON f.user_id = fn.friend_id\n  WHERE fn.degree < 3\n)\nSELECT DISTINCT friend_id, MIN(degree) as min_degree\nFROM friends_network\nGROUP BY friend_id;",
        ],
      },
    ],
  },
  {
    id: "security",
    title: "6. Security & Access Control",
    content: "Enterprise-grade security practices for production databases.",
    subtopics: [
      {
        id: "authentication",
        title: "Authentication & Authorization",
        content: "Database users vs application users. Password policies. Certificate-based auth. LDAP/Active Directory integration. OAuth/SAML for cloud. Service accounts with minimal privileges. Rotate credentials regularly.",
      },
      {
        id: "rbac",
        title: "Role-Based Access Control (RBAC)",
        content: "CREATE ROLE for groups. GRANT/REVOKE privileges. Schema-level permissions. Row-level security (RLS). Column-level encryption. Separation of duties: DBA, developer, analyst, app user.",
        examples: [
          "-- RBAC setup\nCREATE ROLE analysts;\nGRANT SELECT ON ALL TABLES IN SCHEMA analytics TO analysts;\n\nCREATE ROLE app_user;\nGRANT SELECT, INSERT, UPDATE ON customers TO app_user;\nGRANT SELECT ON products TO app_user;\n\n-- Row-level security\nCREATE POLICY tenant_isolation ON orders\n  USING (tenant_id = current_setting('app.tenant_id')::INT);\n\nALTER TABLE orders ENABLE ROW LEVEL SECURITY;",
        ],
      },
      {
        id: "sql-injection",
        title: "SQL Injection Prevention",
        content: "NEVER concatenate user input. Use parameterized queries/prepared statements. Input validation and sanitization. Least privilege principle. Stored procedures for complex logic. Web Application Firewall (WAF). OWASP Top 10 awareness.",
        examples: [
          "-- BAD: Vulnerable to SQL injection\n-- query = \"SELECT * FROM users WHERE email = '\" + userInput + \"'\"\n\n-- GOOD: Parameterized query\n-- PreparedStatement: SELECT * FROM users WHERE email = ?\n-- Bind parameter: userInput\n\n-- Application code (Python example)\n-- cursor.execute(\"SELECT * FROM users WHERE email = %s\", (user_email,))",
        ],
      },
      {
        id: "encryption",
        title: "Data Encryption",
        content: "Encryption at rest: TDE (Transparent Data Encryption), filesystem encryption. Encryption in transit: TLS/SSL. Column-level encryption for PII. Key management: AWS KMS, Azure Key Vault, HashiCorp Vault. Tokenization for credit cards.",
      },
      {
        id: "auditing",
        title: "Audit Logging & Compliance",
        content: "Track all DDL/DML operations. pg_audit extension. Centralized log aggregation (ELK, Splunk). Compliance: GDPR, HIPAA, SOC 2, PCI-DSS. Data retention policies. Right to be forgotten implementation.",
      },
    ],
  },
  {
    id: "cloud-databases",
    title: "7. Cloud & Distributed Databases",
    content: "Modern cloud-native database architectures and managed services.",
    subtopics: [
      {
        id: "aws-databases",
        title: "AWS Database Services",
        content: "RDS (managed relational): PostgreSQL, MySQL, Oracle, SQL Server. Aurora (MySQL/PostgreSQL compatible, 5x performance). Redshift (data warehouse, columnar). DynamoDB (NoSQL). Timestream (time-series). Neptune (graph). DocumentDB (MongoDB compatible).",
      },
      {
        id: "azure-databases",
        title: "Azure Database Services",
        content: "Azure SQL Database (PaaS SQL Server). Azure Database for PostgreSQL/MySQL. Cosmos DB (multi-model, global distribution). Synapse Analytics (data warehouse). SQL Managed Instance (lift-and-shift).",
      },
      {
        id: "gcp-databases",
        title: "Google Cloud Databases",
        content: "Cloud SQL (MySQL, PostgreSQL, SQL Server). Cloud Spanner (globally distributed ACID). BigQuery (serverless data warehouse, petabyte-scale). Firestore (NoSQL). Bigtable (wide-column, HBase compatible).",
      },
      {
        id: "multi-region",
        title: "Multi-Region & High Availability",
        content: "Read replicas for scale-out. Synchronous vs asynchronous replication. Failover strategies: automatic vs manual. RPO (Recovery Point Objective) and RTO (Recovery Time Objective). Active-active vs active-passive. Conflict resolution in multi-master setups.",
      },
      {
        id: "serverless-sql",
        title: "Serverless SQL",
        content: "Aurora Serverless: auto-scaling, pay per request. BigQuery: no infrastructure management. Azure SQL Serverless: pause/resume, scale automatically. Use cases: intermittent workloads, dev/test, unpredictable traffic.",
      },
    ],
  },
  {
    id: "data-warehousing",
    title: "8. Data Warehousing & Analytics",
    content: "OLAP systems for business intelligence and analytics.",
    subtopics: [
      {
        id: "oltp-vs-olap",
        title: "OLTP vs OLAP",
        content: "OLTP (Online Transaction Processing): normalized, row-oriented, high concurrency, millisecond latency, current data. Examples: e-commerce, banking. OLAP (Online Analytical Processing): denormalized, column-oriented, complex queries, historical data. Examples: BI dashboards, data science.",
      },
      {
        id: "star-snowflake",
        title: "Star & Snowflake Schema",
        content: "Star: Fact table (measures) + dimension tables (context). Snowflake: Normalized dimensions. Galaxy/Constellation: Multiple fact tables. Slowly Changing Dimensions (SCD): Type 1 (overwrite), Type 2 (versioned), Type 3 (limited history).",
        examples: [
          "-- Star schema example\nCREATE TABLE fact_sales (\n  sale_id BIGSERIAL PRIMARY KEY,\n  date_key INT REFERENCES dim_date(date_key),\n  product_key INT REFERENCES dim_product(product_key),\n  customer_key INT REFERENCES dim_customer(customer_key),\n  quantity INT,\n  revenue DECIMAL(10,2),\n  cost DECIMAL(10,2)\n);\n\nCREATE TABLE dim_date (\n  date_key INT PRIMARY KEY,\n  full_date DATE,\n  year INT,\n  quarter INT,\n  month INT,\n  day_of_week INT\n);",
        ],
      },
      {
        id: "columnar-storage",
        title: "Columnar Storage",
        content: "Store data by column, not row. Benefits: compression (10-100x), query performance (read only needed columns), aggregations. Parquet, ORC formats. Used in: Redshift, BigQuery, Snowflake, ClickHouse.",
      },
      {
        id: "data-modeling",
        title: "Dimensional Modeling",
        content: "Kimball methodology: business-driven, conformed dimensions, drill-down/roll-up. Inmon methodology: normalized enterprise data warehouse. Data Vault 2.0: agile, scalable, auditable (Hubs, Links, Satellites).",
      },
      {
        id: "incremental-loading",
        title: "Incremental Data Loading",
        content: "Full load vs incremental. Change Data Capture (CDC): log-based (Debezium), trigger-based, timestamp-based. Upsert patterns (MERGE statement). Delta tables for versioning.",
        examples: [
          "-- MERGE statement (upsert)\nMERGE INTO target_table t\nUSING source_table s\nON t.id = s.id\nWHEN MATCHED THEN\n  UPDATE SET t.value = s.value, t.updated_at = CURRENT_TIMESTAMP\nWHEN NOT MATCHED THEN\n  INSERT (id, value, created_at) \n  VALUES (s.id, s.value, CURRENT_TIMESTAMP);",
        ],
      },
    ],
  },
  {
    id: "etl-elt",
    title: "9. ETL/ELT & Data Pipelines",
    content: "Modern data integration and pipeline orchestration.",
    subtopics: [
      {
        id: "etl-vs-elt",
        title: "ETL vs ELT",
        content: "ETL (Extract, Transform, Load): Transform outside warehouse, traditional approach. Tools: Informatica, Talend, SSIS. ELT (Extract, Load, Transform): Transform in warehouse using SQL, modern approach. Tools: Fivetran, Airbyte, Stitch. ELT leverages warehouse compute power.",
      },
      {
        id: "orchestration",
        title: "Pipeline Orchestration",
        content: "Airflow (Apache): Python-based DAGs, extensible. Prefect: modern alternative, better UI. Dagster: asset-oriented. dbt (data build tool): SQL-based transformations, version control, testing, documentation. Luigi, Argo Workflows.",
        examples: [
          "-- dbt model example\n-- models/staging/stg_orders.sql\n{{ config(materialized='view') }}\n\nSELECT\n  order_id,\n  customer_id,\n  order_date,\n  total_amount,\n  status,\n  created_at\nFROM {{ source('raw', 'orders') }}\nWHERE deleted_at IS NULL",
        ],
      },
      {
        id: "cdc-streaming",
        title: "Change Data Capture & Streaming",
        content: "Real-time data replication. Debezium: Kafka-based CDC. AWS DMS (Database Migration Service). Log-based replication. Stream processing: Kafka Streams, Flink, Spark Streaming.",
      },
      {
        id: "data-quality",
        title: "Data Quality & Testing",
        content: "Great Expectations: data validation framework. dbt tests: uniqueness, not_null, relationships, custom SQL. Data contracts. Schema validation. Completeness, accuracy, consistency, timeliness checks.",
      },
    ],
  },
  {
    id: "real-time-analytics",
    title: "10. Real-Time Analytics",
    content: "Low-latency data processing for instant insights.",
    subtopics: [
      {
        id: "streaming-databases",
        title: "Streaming Databases",
        content: "ksqlDB: SQL on Kafka streams. Apache Druid: real-time OLAP, sub-second queries. ClickHouse: columnar, blazing fast aggregations. Apache Pinot: LinkedIn's real-time analytics. RisingWave: Postgres-compatible streaming.",
        examples: [
          "-- ksqlDB: Continuous query\nCREATE STREAM user_clicks (\n  user_id VARCHAR,\n  page VARCHAR,\n  timestamp BIGINT\n) WITH (kafka_topic='clicks', value_format='json');\n\nCREATE TABLE clicks_per_user AS\n  SELECT user_id, COUNT(*) as click_count\n  FROM user_clicks\n  WINDOW TUMBLING (SIZE 5 MINUTES)\n  GROUP BY user_id\n  EMIT CHANGES;",
        ],
      },
      {
        id: "time-series",
        title: "Time-Series Databases",
        content: "TimescaleDB: PostgreSQL extension for time-series. InfluxDB: purpose-built for metrics. Prometheus: monitoring and alerting. Optimizations: continuous aggregates, compression, retention policies. Use cases: IoT, monitoring, financial tickers.",
        examples: [
          "-- TimescaleDB hypertable\nCREATE TABLE sensor_data (\n  time TIMESTAMPTZ NOT NULL,\n  sensor_id INT,\n  temperature DOUBLE PRECISION,\n  humidity DOUBLE PRECISION\n);\n\nSELECT create_hypertable('sensor_data', 'time');\n\n-- Continuous aggregate\nCREATE MATERIALIZED VIEW sensor_hourly\nWITH (timescaledb.continuous) AS\nSELECT time_bucket('1 hour', time) AS hour,\n  sensor_id,\n  AVG(temperature) as avg_temp\nFROM sensor_data\nGROUP BY hour, sensor_id;",
        ],
      },
      {
        id: "lambda-kappa",
        title: "Lambda & Kappa Architecture",
        content: "Lambda: Batch layer + Speed layer + Serving layer. Kappa: Stream processing only (simplified lambda). Tools: Kafka + Flink/Spark + Druid/Cassandra. Trade-offs: complexity vs latency.",
      },
    ],
  },
  {
    id: "ai-ml-integration",
    title: "11. AI/ML Integration with SQL",
    content: "Merging traditional SQL with artificial intelligence and machine learning.",
    subtopics: [
      {
        id: "ml-in-database",
        title: "In-Database Machine Learning",
        content: "PostgresML: Train models with SQL. BigQuery ML: CREATE MODEL syntax. Oracle ML. SQL Server ML Services (R/Python). Benefits: data doesn't leave database, leverage SQL skills, production-ready predictions.",
        examples: [
          "-- BigQuery ML: Linear regression\nCREATE MODEL `project.dataset.sales_forecast`\nOPTIONS(model_type='linear_reg') AS\nSELECT\n  temperature,\n  day_of_week,\n  is_holiday,\n  sales as label\nFROM `project.dataset.historical_sales`;\n\n-- Make predictions\nSELECT *\nFROM ML.PREDICT(MODEL `project.dataset.sales_forecast`,\n  (SELECT 75 as temperature, 5 as day_of_week, false as is_holiday)\n);",
        ],
      },
      {
        id: "vector-databases",
        title: "Vector Databases & Embeddings",
        content: "pgvector: PostgreSQL extension for vector similarity search. Pinecone: managed vector DB. Weaviate, Milvus, Qdrant. Store AI embeddings (OpenAI, Cohere). Cosine similarity, L2 distance. Use cases: semantic search, recommendation engines, RAG (Retrieval Augmented Generation).",
        examples: [
          "-- pgvector setup\nCREATE EXTENSION vector;\n\nCREATE TABLE documents (\n  id SERIAL PRIMARY KEY,\n  content TEXT,\n  embedding vector(1536)  -- OpenAI ada-002 dimension\n);\n\nCREATE INDEX ON documents \n  USING ivfflat (embedding vector_cosine_ops)\n  WITH (lists = 100);\n\n-- Similarity search\nSELECT id, content, \n  1 - (embedding <=> '[0.1, 0.2, ...]'::vector) as similarity\nFROM documents\nORDER BY embedding <=> '[0.1, 0.2, ...]'::vector\nLIMIT 5;",
        ],
      },
      {
        id: "llm-sql",
        title: "LLMs for SQL Generation",
        content: "Text-to-SQL: Natural language to SQL queries. Tools: OpenAI GPT-4, Anthropic Claude, specialized models (CodeLlama). Challenges: schema understanding, ambiguity, hallucinations. Solutions: few-shot prompting, schema injection, query validation.",
      },
      {
        id: "feature-stores",
        title: "Feature Stores",
        content: "Centralized repository for ML features. Feast, Tecton, Hopsworks. Online (low-latency serving) + Offline (training data). Point-in-time correctness. Feature versioning and lineage.",
      },
      {
        id: "model-serving",
        title: "Model Serving in SQL",
        content: "UDFs (User-Defined Functions) for model inference. TensorFlow/PyTorch model deployment. Batch predictions vs real-time. Model versioning and A/B testing. MLOps integration.",
        examples: [
          "-- PostgreSQL: Custom function for model prediction\nCREATE OR REPLACE FUNCTION predict_churn(customer_features JSONB)\nRETURNS FLOAT AS $$\n  import pickle\n  import json\n  \n  # Load model (cached in production)\n  with open('/models/churn_model.pkl', 'rb') as f:\n    model = pickle.load(f)\n  \n  features = json.loads(customer_features)\n  prediction = model.predict_proba([list(features.values())])[0][1]\n  return float(prediction)\n$$ LANGUAGE plpython3u;",
        ],
      },
    ],
  },
  {
    id: "advanced-topics",
    title: "12. Advanced Enterprise Topics",
    content: "Specialized topics for large-scale production systems.",
    subtopics: [
      {
        id: "database-migration",
        title: "Database Migrations",
        content: "Zero-downtime migrations. Blue-green deployments. Expand-contract pattern. Schema versioning: Flyway, Liquibase, Alembic. Backward compatibility. Rollback strategies.",
        examples: [
          "-- Expand-contract migration\n-- Step 1: Add new column (nullable)\nALTER TABLE users ADD COLUMN full_name VARCHAR(200);\n\n-- Step 2: Backfill data\nUPDATE users SET full_name = first_name || ' ' || last_name;\n\n-- Step 3: Deploy app using new column\n-- Step 4: Make column NOT NULL\nALTER TABLE users ALTER COLUMN full_name SET NOT NULL;\n\n-- Step 5: Drop old columns\nALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name;",
        ],
      },
      {
        id: "query-federation",
        title: "Query Federation",
        content: "Query across multiple databases. Foreign Data Wrappers (FDW): postgres_fdw, mysql_fdw. Presto/Trino: distributed SQL engine. Apache Drill. Use cases: data lake queries, cross-system reporting.",
      },
      {
        id: "nosql-integration",
        title: "SQL + NoSQL Integration",
        content: "Polyglot persistence. Use SQL for transactions, NoSQL for scale. MongoDB aggregation pipeline vs SQL. Cassandra CQL. Redis for caching. Event sourcing with SQL + Kafka.",
      },
      {
        id: "graph-databases",
        title: "Graph Databases",
        content: "Neo4j Cypher language. Amazon Neptune (Gremlin/SPARQL). Graph use cases: fraud detection, social networks, knowledge graphs, recommendation engines. When to use SQL vs graph DB.",
        examples: [
          "-- Cypher (Neo4j): Find friends of friends\nMATCH (user:Person {name: 'John'})-[:FRIENDS_WITH]->(friend)-[:FRIENDS_WITH]->(fof)\nWHERE NOT (user)-[:FRIENDS_WITH]->(fof) AND user <> fof\nRETURN fof.name, COUNT(*) as mutual_friends\nORDER BY mutual_friends DESC;",
        ],
      },
      {
        id: "multitenancy",
        title: "Multi-Tenancy Patterns",
        content: "Separate database per tenant (isolation, expensive). Shared database, separate schemas (middle ground). Shared schema with tenant_id (cost-effective, careful RLS). Tenant sharding for scale.",
      },
    ],
  },
  {
    id: "modern-stack",
    title: "13. Modern Data Stack",
    content: "The complete ecosystem for data-driven organizations.",
    subtopics: [
      {
        id: "data-stack-overview",
        title: "Modern Data Stack Components",
        content: "Ingestion: Fivetran, Airbyte. Warehouse: Snowflake, BigQuery, Databricks. Transformation: dbt. Orchestration: Airflow, Prefect. BI: Looker, Tableau, Metabase. Reverse ETL: Census, Hightouch. Observability: Monte Carlo, Datafold.",
      },
      {
        id: "lakehouse",
        title: "Data Lakehouse Architecture",
        content: "Unified platform: data lake + data warehouse. Delta Lake, Apache Iceberg, Apache Hudi. ACID transactions on data lake. Schema evolution. Time travel. Open formats. Databricks Lakehouse, AWS Lake Formation.",
      },
      {
        id: "data-mesh",
        title: "Data Mesh",
        content: "Domain-oriented decentralized data ownership. Data as a product. Self-serve data platform. Federated computational governance. Challenges centralized data warehouse approach.",
      },
      {
        id: "reverse-etl",
        title: "Reverse ETL",
        content: "Sync warehouse data back to operational systems. Census, Hightouch. Use cases: CRM enrichment, marketing automation, customer 360. Activate data where business happens.",
      },
      {
        id: "data-observability",
        title: "Data Observability",
        content: "Monitor data pipeline health. Freshness, volume, schema changes, distribution anomalies. Monte Carlo, Great Expectations, dbt tests. Data lineage tracking. Incident management.",
      },
    ],
  },
  {
    id: "future-trends",
    title: "14. Future of SQL & Databases",
    content: "Emerging trends shaping the next decade of data management.",
    subtopics: [
      {
        id: "edge-databases",
        title: "Edge Computing & Databases",
        content: "Database at the edge: Cloudflare D1, Fly.io Postgres. Reduce latency for global apps. Sync edge <> central. Use cases: IoT, mobile apps, edge AI.",
      },
      {
        id: "quantum-db",
        title: "Quantum Databases",
        content: "Quantum computing impact on databases. Quantum key distribution for security. Research stage: quantum query optimization, quantum machine learning integration.",
      },
      {
        id: "automated-dba",
        title: "AI-Powered Database Administration",
        content: "Self-tuning databases. Automated index recommendations. Query optimization AI. Anomaly detection. Chatbot DBAs. AWS RDS Performance Insights, Azure SQL Database Advisor.",
      },
      {
        id: "blockchain-db",
        title: "Blockchain & Distributed Ledgers",
        content: "Immutable audit logs. Smart contract integration. SQL on blockchain: BigchainDB. Use cases: supply chain, financial services, healthcare records.",
      },
      {
        id: "unified-analytics",
        title: "Unified Analytics Platforms",
        content: "One platform for all analytics: batch, streaming, ML, graph. Databricks, Google BigQuery Omni, Snowflake. SQL as universal interface. Cross-cloud analytics.",
      },
    ],
  },
  {
    id: "best-practices",
    title: "15. Production Best Practices",
    content: "Battle-tested practices from industry leaders.",
    subtopics: [
      {
        id: "naming-conventions",
        title: "Naming Conventions",
        content: "Tables: plural nouns (users, orders). Columns: snake_case. Primary keys: id or table_name_id. Foreign keys: referenced_table_id. Indexes: idx_table_columns. Constraints: pk_, fk_, uk_, ck_. Be consistent across organization.",
      },
      {
        id: "documentation",
        title: "Documentation & Data Dictionary",
        content: "COMMENT ON TABLE/COLUMN. Maintain data dictionary. dbt docs generate. Schema Registry for event schemas. ERD diagrams. Update docs with code changes.",
      },
      {
        id: "version-control",
        title: "Version Control for Databases",
        content: "All DDL in Git. Migration scripts versioned. dbt models in Git. Code review for schema changes. Branching strategy: feature branches, main, production.",
      },
      {
        id: "monitoring",
        title: "Database Monitoring",
        content: "Metrics: query latency, throughput, connection pool, cache hit ratio, replication lag. Tools: Prometheus + Grafana, Datadog, New Relic. Slow query log analysis. Alert on anomalies.",
      },
      {
        id: "disaster-recovery",
        title: "Backup & Disaster Recovery",
        content: "Automated daily backups. Point-in-time recovery (PITR). Test restores regularly. Off-site backup storage. Document recovery procedures. RTO/RPO targets. Chaos engineering for DR.",
      },
      {
        id: "cost-optimization",
        title: "Cost Optimization",
        content: "Right-size instances. Use reserved/spot instances. Implement data lifecycle policies. Compress old data. Auto-scaling. Query optimization reduces compute. Monitor with AWS Cost Explorer, GCP Billing.",
      },
    ],
  },
  {
    id: "career",
    title: "16. Career & Learning Path",
    content: "Building expertise and advancing your database career.",
    subtopics: [
      {
        id: "certifications",
        title: "Industry Certifications",
        content: "AWS Certified Database Specialty. Google Professional Data Engineer. Microsoft Azure Database Administrator. Oracle Database Certification. Snowflake SnowPro. dbt Analytics Engineering.",
      },
      {
        id: "roles",
        title: "Database Career Paths",
        content: "Database Administrator (DBA): operations, performance, backups. Data Engineer: pipelines, ETL, data modeling. Analytics Engineer: dbt, SQL, BI tools. Data Architect: system design, technology selection. Database Reliability Engineer (DBRE): SRE for databases.",
      },
      {
        id: "resources",
        title: "Continuous Learning",
        content: "Books: Designing Data-Intensive Applications (Kleppmann), Database Internals (Petrov). Courses: Stanford CS145, CMU Database Systems. Practice: LeetCode SQL, HackerRank, DataLemur. Communities: r/SQL, r/databases, Database Discord servers.",
      },
    ],
  },
];

export function Guide() {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(["intro"]));
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTopic = (id: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTopics(newExpanded);
  };

  const filterTopics = (topics: Topic[], query: string): Topic[] => {
    if (!query) return topics;
    
    return topics.filter(topic => {
      const matchesTitle = topic.title.toLowerCase().includes(query.toLowerCase());
      const matchesContent = topic.content.toLowerCase().includes(query.toLowerCase());
      const matchesSubtopics = topic.subtopics?.some(sub => 
        sub.title.toLowerCase().includes(query.toLowerCase()) ||
        sub.content.toLowerCase().includes(query.toLowerCase())
      );
      
      return matchesTitle || matchesContent || matchesSubtopics;
    });
  };

  const renderTopic = (topic: Topic, level: number = 0) => {
    const isExpanded = expandedTopics.has(topic.id);
    const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;

    return (
      <div key={topic.id} className="mb-4">
        <button
          onClick={() => toggleTopic(topic.id)}
          className="w-full text-left p-4 rounded-2xl transition-all hover:scale-[1.01]"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
            marginLeft: `${level * 20}px`,
          }}
        >
          <div className="flex items-center gap-3">
            {hasSubtopics && (
              isExpanded ? (
                <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
              ) : (
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
              )
            )}
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {topic.title}
            </span>
          </div>
        </button>

        {isExpanded && (
          <div
            className="mt-2 p-4 rounded-2xl"
            style={{
              backgroundColor: "var(--bg-elevated)",
              marginLeft: `${level * 20 + 20}px`,
            }}
          >
            <p className="mb-4" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {topic.content}
            </p>

            {topic.examples && topic.examples.length > 0 && (
              <div className="mt-4">
                <p className="text-sm mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  Examples:
                </p>
                {topic.examples.map((example, idx) => (
                  <pre
                    key={idx}
                    className="p-3 rounded-lg mb-2 text-sm font-mono overflow-x-auto"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      color: "var(--color-primary)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {example}
                  </pre>
                ))}
              </div>
            )}

            {hasSubtopics && (
              <div className="mt-4 space-y-2">
                {topic.subtopics!.map(subtopic => renderTopic(subtopic, level + 1))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const filteredTopics = filterTopics(sqlGuideData, searchQuery);

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
            >
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
                SQL Complete Guide
              </h1>
              <p style={{ color: "var(--text-secondary)" }}>
                From basics to AI integration - Industry-ready SQL mastery
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl outline-none"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--color-border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* External Resources */}
        <div
          className="p-6 rounded-2xl mb-8"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="text-lg mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            📚 External Resources
          </h2>
          <div className="space-y-3">
            <a
              href="https://www.postgresql.org/docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--bg-elevated)" }}
            >
              <ExternalLink className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <span style={{ color: "var(--text-primary)" }}>PostgreSQL Official Documentation</span>
            </a>
            <a
              href="https://dev.mysql.com/doc/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--bg-elevated)" }}
            >
              <ExternalLink className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <span style={{ color: "var(--text-primary)" }}>MySQL Official Documentation</span>
            </a>
            <a
              href="https://sqlzoo.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--bg-elevated)" }}
            >
              <ExternalLink className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <span style={{ color: "var(--text-primary)" }}>SQLZoo - Interactive SQL Tutorial</span>
            </a>
            <a
              href="https://mode.com/sql-tutorial/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--bg-elevated)" }}
            >
              <ExternalLink className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <span style={{ color: "var(--text-primary)" }}>Mode SQL Tutorial - Advanced Analytics</span>
            </a>
            <a
              href="https://learnsql.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--bg-elevated)" }}
            >
              <ExternalLink className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <span style={{ color: "var(--text-primary)" }}>LearnSQL - Comprehensive Course Platform</span>
            </a>
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map(topic => renderTopic(topic))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                No topics found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
