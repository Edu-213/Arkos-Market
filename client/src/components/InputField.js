import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const InputField = ({id, type = 'text', label, value, onChange, error, maxLength}) => {
    return (
        <div className='relative'>
            <input type={type} id={id} maxLength={maxLength} value={value} onChange={onChange} className='peer block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
            <label htmlFor={id} className={`absolute left-3 text-gray-500 transition-all duration-200 transform ${value ? 'top-0 text-xs text-blue-500' : 'top-2 text-base'} peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500`} >
                {label}
            </label>
            {error && <p className="text-red-600 mt-1 text-sm sm:text-base"><FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" /> {error}</p>}
        </div>
    );
};

export default InputField;