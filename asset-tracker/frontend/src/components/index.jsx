export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  icon,
  ...props 
}) {
  const baseClasses = 'btn transition-all duration-200';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'px-4 py-2',
    lg: 'btn-lg',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <span className="animate-spin">⟳</span>}
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

export function Card({ children, className = '', hoverable = false }) {
  return (
    <div className={`card ${hoverable ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'info' }) {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
  };

  return (
    <span className={`badge ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

export function Input({ 
  label, 
  error, 
  icon,
  ...props 
}) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
        <input 
          className={`input-base ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function Select({ 
  label, 
  error, 
  options = [],
  ...props 
}) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select 
        className={`input-base ${error ? 'input-error' : ''}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function Table({ columns, data, actions, onAction, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin text-blue-600 text-3xl">⟳</div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table-styled">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td>
                    <div className="flex gap-2">
                      {actions.map(action => (
                        <Button
                          key={action.label}
                          size="sm"
                          variant={action.variant || 'secondary'}
                          onClick={() => onAction && onAction(action.key, row)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <Card className="w-full max-w-md relative animate-fadeIn">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
          {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
          <div className="mb-6">{children}</div>
          {actions && (
            <div className="flex gap-2 justify-end">
              {actions.map(action => (
                <Button
                  key={action.label}
                  variant={action.variant || 'secondary'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export function Alert({ variant = 'info', children, onClose }) {
  const variantClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div className={`border rounded-lg p-4 ${variantClasses[variant]} flex justify-between items-center`}>
      <div>{children}</div>
      {onClose && (
        <button onClick={onClose} className="text-lg cursor-pointer hover:opacity-70">✕</button>
      )}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin text-blue-600 text-4xl">⟳</div>
    </div>
  );
}

export function EmptyState({ icon = '📦', title, subtitle }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      {subtitle && <p className="text-gray-500">{subtitle}</p>}
    </div>
  );
}
