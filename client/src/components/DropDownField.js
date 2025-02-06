import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const DropdownField = ({label, options, selectedOption, onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='relative'>
            <div onClick={() => setIsOpen(!isOpen)} className='cursor-pointer w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer min-h-10'>
                <p className={`absolute left-3 text-gray-500 transition-all duration-200 transform ${selectedOption ? 'top-0 text-xs text-blue-500' : 'top-2 text-base'} peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500`}> {label} </p>
                {selectedOption || ""}
                <FontAwesomeIcon icon={faChevronDown} className={`absolute right-3 top-3 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
            {isOpen && (
                <div className='absolute w-full bg-white border bordergray-300 rounded-md mt-1 shadow-lg z-10'>
                    {options.map((option) => (
                        <div key={option} onClick={() => {
                            onSelect(option);
                            setIsOpen(false);
                        }} className='cursor-pointer px-3 py-2 hover:bg-gray-200'>
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownField;