import React from 'react';

export default function StatusToggle({ status, onChange, disabled }) {
    // status: 'Offline', 'Available', 'On Trip'

    const handleToggle = () => {
        if (disabled) return;
        onChange(status === 'Offline' ? 'Available' : 'Offline');
    };

    return (
        <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${status === 'Offline' ? 'text-gray-500' : 'text-gray-200'}`}>
                {status === 'On Trip' ? 'On Trip' : status}
            </span>
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-900 ${status === 'Available' ? 'bg-success' :
                        status === 'On Trip' ? 'bg-primary' : 'bg-dark-700'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                role="switch"
                aria-checked={status !== 'Offline'}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${status !== 'Offline' ? 'translate-x-7' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    );
}
