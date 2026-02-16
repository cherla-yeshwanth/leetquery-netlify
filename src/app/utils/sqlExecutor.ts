// Simple SQL executor with mock database
export interface SQLResult {
  success: boolean;
  columns?: string[];
  rows?: any[][];
  rowCount?: number;
  executionTime?: string;
  message?: string;
  error?: string;
}

// Mock database tables
const mockDatabase: { [key: string]: any[] } = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", created_at: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", created_at: "2024-01-16" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", created_at: "2024-01-17" },
    { id: 4, name: "Alice Williams", email: "alice@example.com", created_at: "2024-01-18" },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com", created_at: "2024-01-19" },
  ],
  products: [
    { id: 1, name: "Laptop", price: 999.99, category: "Electronics", stock: 50 },
    { id: 2, name: "Mouse", price: 29.99, category: "Electronics", stock: 200 },
    { id: 3, name: "Keyboard", price: 79.99, category: "Electronics", stock: 150 },
    { id: 4, name: "Monitor", price: 299.99, category: "Electronics", stock: 75 },
    { id: 5, name: "Desk Chair", price: 199.99, category: "Furniture", stock: 30 },
  ],
  orders: [
    { id: 1, user_id: 1, product_id: 1, quantity: 1, total: 999.99, order_date: "2024-01-20" },
    { id: 2, user_id: 2, product_id: 2, quantity: 2, total: 59.98, order_date: "2024-01-21" },
    { id: 3, user_id: 1, product_id: 3, quantity: 1, total: 79.99, order_date: "2024-01-22" },
    { id: 4, user_id: 3, product_id: 4, quantity: 1, total: 299.99, order_date: "2024-01-23" },
    { id: 5, user_id: 4, product_id: 5, quantity: 2, total: 399.98, order_date: "2024-01-24" },
  ],
  employees: [
    { id: 1, name: "Sarah Connor", department: "Engineering", salary: 95000, hire_date: "2023-01-15" },
    { id: 2, name: "John Connor", department: "Engineering", salary: 85000, hire_date: "2023-03-20" },
    { id: 3, name: "Kyle Reese", department: "Sales", salary: 75000, hire_date: "2023-02-10" },
    { id: 4, name: "Ellen Ripley", department: "HR", salary: 70000, hire_date: "2023-04-05" },
    { id: 5, name: "Dutch Schaefer", department: "Sales", salary: 80000, hire_date: "2023-05-12" },
  ],
  student: [
    { id: 1, name: "Emma Watson", age: 20, grade: "A" },
    { id: 2, name: "Liam Chen", age: 21, grade: "B" },
    { id: 3, name: "Sophia Martinez", age: 19, grade: "A" },
    { id: 4, name: "Noah Johnson", age: 22, grade: "C" },
    { id: 5, name: "Olivia Brown", age: 20, grade: "B" },
  ],
};

export function executeSQL(query: string): SQLResult {
  const startTime = performance.now();
  
  // Remove comments and trim
  const cleanQuery = query
    .split('\n')
    .map(line => line.replace(/--.*$/, '').trim())
    .filter(line => line.length > 0)
    .join(' ')
    .trim();

  if (!cleanQuery) {
    return {
      success: false,
      error: "Empty query",
    };
  }

  try {
    // Detect query type
    const queryUpper = cleanQuery.toUpperCase();
    
    if (queryUpper.startsWith('SELECT')) {
      return executeSelect(cleanQuery, startTime);
    } else if (queryUpper.startsWith('CREATE TABLE')) {
      return executeCreateTable(cleanQuery, startTime);
    } else if (queryUpper.startsWith('INSERT INTO')) {
      return executeInsert(cleanQuery, startTime);
    } else if (queryUpper.startsWith('UPDATE')) {
      return executeUpdate(cleanQuery, startTime);
    } else if (queryUpper.startsWith('DELETE FROM')) {
      return executeDelete(cleanQuery, startTime);
    } else if (queryUpper.startsWith('DROP TABLE')) {
      return executeDropTable(cleanQuery, startTime);
    } else {
      return {
        success: false,
        error: `Unsupported query type. Supported: SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, DROP TABLE`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Query execution failed",
    };
  }
}

function executeSelect(query: string, startTime: number): SQLResult {
  // Parse SELECT query
  const fromMatch = query.match(/FROM\s+(\w+)/i);
  if (!fromMatch) {
    return {
      success: false,
      error: "Syntax error: Missing FROM clause",
    };
  }

  const tableName = fromMatch[1].toLowerCase();
  if (!mockDatabase[tableName]) {
    return {
      success: false,
      error: `Table '${tableName}' doesn't exist`,
    };
  }

  let data = [...mockDatabase[tableName]];

  // Handle WHERE clause
  const whereMatch = query.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|\s+GROUP\s+BY|$)/i);
  if (whereMatch) {
    const condition = whereMatch[1].trim();
    data = data.filter(row => evaluateCondition(row, condition));
  }

  // Handle ORDER BY
  const orderMatch = query.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
  if (orderMatch) {
    const column = orderMatch[1];
    const direction = orderMatch[2]?.toUpperCase() || 'ASC';
    data.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return direction === 'DESC' ? -comparison : comparison;
    });
  }

  // Handle LIMIT
  const limitMatch = query.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    data = data.slice(0, parseInt(limitMatch[1]));
  }

  // Handle column selection
  const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
  if (!selectMatch) {
    return {
      success: false,
      error: "Syntax error: Invalid SELECT statement",
    };
  }

  const selectClause = selectMatch[1].trim();
  let columns: string[];
  let rows: any[][];

  if (selectClause === '*') {
    // Select all columns
    if (data.length === 0) {
      return {
        success: true,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTime: `${((performance.now() - startTime) / 1000).toFixed(3)}s`,
        message: "0 rows returned",
      };
    }
    columns = Object.keys(data[0]);
    rows = data.map(row => columns.map(col => row[col]));
  } else {
    // Select specific columns
    columns = selectClause.split(',').map(col => {
      const trimmed = col.trim();
      // Handle aggregate functions
      if (trimmed.match(/COUNT\s*\(/i)) return 'count';
      if (trimmed.match(/SUM\s*\(/i)) return 'sum';
      if (trimmed.match(/AVG\s*\(/i)) return 'avg';
      if (trimmed.match(/MAX\s*\(/i)) return 'max';
      if (trimmed.match(/MIN\s*\(/i)) return 'min';
      // Handle AS alias
      const asMatch = trimmed.match(/AS\s+(\w+)/i);
      if (asMatch) return asMatch[1];
      return trimmed;
    });

    // Check for aggregate functions
    if (selectClause.match(/COUNT|SUM|AVG|MAX|MIN/i)) {
      rows = [handleAggregates(data, selectClause)];
    } else {
      rows = data.map(row => 
        columns.map(col => {
          if (row[col] === undefined) {
            throw new Error(`Unknown column '${col}' in field list`);
          }
          return row[col];
        })
      );
    }
  }

  const executionTime = `${((performance.now() - startTime) / 1000).toFixed(3)}s`;

  return {
    success: true,
    columns,
    rows,
    rowCount: rows.length,
    executionTime,
    message: `${rows.length} row${rows.length !== 1 ? 's' : ''} returned`,
  };
}

function executeCreateTable(query: string, startTime: number): SQLResult {
  const match = query.match(/CREATE\s+TABLE\s+(\w+)/i);
  if (!match) {
    return {
      success: false,
      error: "Syntax error: Invalid CREATE TABLE statement",
    };
  }

  const tableName = match[1].toLowerCase();
  if (mockDatabase[tableName]) {
    return {
      success: false,
      error: `Table '${tableName}' already exists`,
    };
  }

  // Create empty table
  mockDatabase[tableName] = [];
  const executionTime = `${((performance.now() - startTime) / 1000).toFixed(3)}s`;

  return {
    success: true,
    executionTime,
    message: `Table '${tableName}' created successfully`,
  };
}

function executeInsert(query: string, startTime: number): SQLResult {
  const match = query.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (!match) {
    return {
      success: false,
      error: "Syntax error: Invalid INSERT statement",
    };
  }

  const tableName = match[1].toLowerCase();
  if (!mockDatabase[tableName]) {
    return {
      success: false,
      error: `Table '${tableName}' doesn't exist`,
    };
  }

  const columns = match[2].split(',').map(c => c.trim());
  const values = match[3].split(',').map(v => {
    v = v.trim();
    // Remove quotes from strings
    if (v.startsWith("'") && v.endsWith("'")) {
      return v.slice(1, -1);
    }
    // Parse numbers
    if (!isNaN(Number(v))) {
      return Number(v);
    }
    return v;
  });

  const row: any = {};
  columns.forEach((col, i) => {
    row[col] = values[i];
  });

  mockDatabase[tableName].push(row);
  const executionTime = `${((performance.now() - startTime) / 1000).toFixed(3)}s`;

  return {
    success: true,
    executionTime,
    rowCount: 1,
    message: "1 row inserted",
  };
}

function executeUpdate(query: string, startTime: number): SQLResult {
  const match = query.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?$/i);
  if (!match) {
    return {
      success: false,
      error: "Syntax error: Invalid UPDATE statement",
    };
  }

  const tableName = match[1].toLowerCase();
  if (!mockDatabase[tableName]) {
    return {
      success: false,
      error: `Table '${tableName}' doesn't exist`,
    };
  }

  const setClause = match[2];
  const whereClause = match[3];

  let updatedCount = 0;
  mockDatabase[tableName].forEach(row => {
    if (!whereClause || evaluateCondition(row, whereClause)) {
      // Parse SET clause
      const updates = setClause.split(',').map(s => s.trim());
      updates.forEach(update => {
        const [col, val] = update.split('=').map(s => s.trim());
        let value = val.replace(/^'|'$/g, '');
        if (!isNaN(Number(value))) {
          value = Number(value);
        }
        row[col] = value;
      });
      updatedCount++;
    }
  });

  const executionTime = `${((performance.now() - startTime) / 1000).toFixed(3)}s`;

  return {
    success: true,
    executionTime,
    rowCount: updatedCount,
    message: `${updatedCount} row${updatedCount !== 1 ? 's' : ''} updated`,
  };
}

function executeDelete(query: string, startTime: number): SQLResult {
  const match = query.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i);
  if (!match) {
    return {
      success: false,
      error: "Syntax error: Invalid DELETE statement",
    };
  }

  const tableName = match[1].toLowerCase();
  if (!mockDatabase[tableName]) {
    return {
      success: false,
      error: `Table '${tableName}' doesn't exist`,
    };
  }

  const whereClause = match[2];
  const originalLength = mockDatabase[tableName].length;

  if (whereClause) {
    mockDatabase[tableName] = mockDatabase[tableName].filter(
      row => !evaluateCondition(row, whereClause)
    );
  } else {
    mockDatabase[tableName] = [];
  }

  const deletedCount = originalLength - mockDatabase[tableName].length;
  const executionTime = `${((performance.now() - startTime) / 1000).toFixed(3)}s`;

  return {
    success: true,
    executionTime,
    rowCount: deletedCount,
    message: `${deletedCount} row${deletedCount !== 1 ? 's' : ''} deleted`,
  };
}

function executeDropTable(query: string, startTime: number): SQLResult {
  const match = query.match(/DROP\s+TABLE\s+(\w+)/i);
  if (!match) {
    return {
      success: false,
      error: "Syntax error: Invalid DROP TABLE statement",
    };
  }

  const tableName = match[1].toLowerCase();
  if (!mockDatabase[tableName]) {
    return {
      success: false,
      error: `Table '${tableName}' doesn't exist`,
    };
  }

  delete mockDatabase[tableName];
  const executionTime = `${((performance.now() - startTime) / 1000).toFixed(3)}s`;

  return {
    success: true,
    executionTime,
    message: `Table '${tableName}' dropped successfully`,
  };
}

function evaluateCondition(row: any, condition: string): boolean {
  // Handle simple conditions: column = value, column > value, etc.
  const operators = ['>=', '<=', '!=', '<>', '=', '>', '<', 'LIKE'];
  
  for (const op of operators) {
    const parts = condition.split(new RegExp(`\\s+${op}\\s+`, 'i'));
    if (parts.length === 2) {
      const column = parts[0].trim();
      let value = parts[1].trim().replace(/^'|'$/g, '');
      
      if (!isNaN(Number(value))) {
        value = Number(value);
      }

      const rowValue = row[column];

      switch (op.toUpperCase()) {
        case '=':
          return rowValue == value;
        case '!=':
        case '<>':
          return rowValue != value;
        case '>':
          return rowValue > value;
        case '<':
          return rowValue < value;
        case '>=':
          return rowValue >= value;
        case '<=':
          return rowValue <= value;
        case 'LIKE':
          const pattern = value.toString().replace(/%/g, '.*');
          return new RegExp(pattern, 'i').test(rowValue?.toString() || '');
      }
    }
  }

  return true;
}

function handleAggregates(data: any[], selectClause: string): any[] {
  const result: any[] = [];
  const aggregates = selectClause.split(',').map(s => s.trim());

  aggregates.forEach(agg => {
    if (agg.match(/COUNT\s*\(\s*\*\s*\)/i)) {
      result.push(data.length);
    } else if (agg.match(/COUNT\s*\(/i)) {
      const col = agg.match(/COUNT\s*\(\s*(\w+)\s*\)/i)?.[1];
      result.push(data.filter(row => row[col!] != null).length);
    } else if (agg.match(/SUM\s*\(/i)) {
      const col = agg.match(/SUM\s*\(\s*(\w+)\s*\)/i)?.[1];
      result.push(data.reduce((sum, row) => sum + (Number(row[col!]) || 0), 0));
    } else if (agg.match(/AVG\s*\(/i)) {
      const col = agg.match(/AVG\s*\(\s*(\w+)\s*\)/i)?.[1];
      const sum = data.reduce((sum, row) => sum + (Number(row[col!]) || 0), 0);
      result.push(data.length > 0 ? sum / data.length : 0);
    } else if (agg.match(/MAX\s*\(/i)) {
      const col = agg.match(/MAX\s*\(\s*(\w+)\s*\)/i)?.[1];
      result.push(Math.max(...data.map(row => Number(row[col!]) || 0)));
    } else if (agg.match(/MIN\s*\(/i)) {
      const col = agg.match(/MIN\s*\(\s*(\w+)\s*\)/i)?.[1];
      result.push(Math.min(...data.map(row => Number(row[col!]) || 0)));
    }
  });

  return result;
}

// Get available tables
export function getAvailableTables(): string[] {
  return Object.keys(mockDatabase);
}

// Get table schema
export function getTableSchema(tableName: string): string[] | null {
  const table = mockDatabase[tableName.toLowerCase()];
  if (!table || table.length === 0) return null;
  return Object.keys(table[0]);
}
