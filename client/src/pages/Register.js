import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faXmark, faEye, faEyeSlash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import InputField from '../components/InputField';
import DropdownField from '../components/DropDownField';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        phone: '',
        cpf: '',
        birthDate: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectGender, setSelectedGender] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handlerGenderClick = (gender) => {
        setSelectedGender(gender);
        setFormData({...formData, gender: gender});
    }

    const validatePassword = (password) => {
        const errors = {};
        if (password.length < 8) errors.length = 'No mínimo 8 dígitos';
        if (!/[A-Z]/.test(password)) errors.uppercase = '1 Letra maiúscula';
        if (!/[a-z]/.test(password)) errors.lowercase = '1 Letra minúscula';
        if (!/[0-9]/.test(password)) errors.number = '1 Número';
        return errors;
    };

    const validateField = (field, value) => {
        let error = "";

        switch (field) {
            case "name":
                if (!value.trim()) error = "É necessário informar seu nome completo.";
                break;
            case "email":
                if (!value.trim()) error = "É necessário informar um e-mail válido.";
                else if (!/\S+@\S+\.\S+/.test(value)) error = "E-mail inválido";
                break;
            case 'phone':
                if (!value.trim()) error = "É necessário informar o número completo no formato (DDD) 99999-9999.";
                else if (!/^\d{10,11}$/.test(value.replace(/[()-\s]/g, ""))) error = 'Número de telefone inválido';
                break;
            case 'cpf':
                if (!value.trim()) error = "É necessário informar um CPF.";
                else if (!/^\d{11}$/.test(value.replace(/[.-]/g, ""))) error = 'CPF inválido';
                break;
            case 'birthDate':
                    if (!value.trim()) error = "É necessário informar sua data de nascimento completa, no formato DD/MM/AAAA.";
                break;
            default:
                break;
        }
        return error;
    }

    const formatCPF = (value) => {
        return value 
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{2})$/, '$1-$2');
    };

    const formatDate = (value) => {
        return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2') 
        .replace(/(\d{4})\d+?$/, '$1'); 
    };

    const formatPhone = (value) => {
        return value
        .replace(/\D/g, '') 
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2'); 
    };

    const handleChange = (field, value) => {
        let formattedValue = value;

        if (field === 'cpf') {
            formattedValue = formatCPF(value);
        } else if (field === 'birthDate') {
            formattedValue = formatDate(value);
        } else if (field === 'phone') {
            formattedValue = formatPhone(value);
        }

        const updatedFormData = { ...formData, [field]: formattedValue };
        
        if (field === "password") {
          setErrors({ ...errors, password: validatePassword(value) });
        } else {
          setErrors({ ...errors, [field]: validateField(field, formattedValue) });
        }

        setFormData(updatedFormData);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const cleanedFormData = { ...formData };
        cleanedFormData.phone = cleanedFormData.phone.replace(/[^\d]/g, '');
        cleanedFormData.cpf = cleanedFormData.cpf.replace(/[^\d]/g, '');
        cleanedFormData.birthDate = cleanedFormData.birthDate.replace(/\//g, '');

        const newErrors = Object.keys(cleanedFormData).reduce((acc, field) => {
            const error = validateField(field, cleanedFormData[field]);
            if (error) acc[field] = error;
            return acc;
        }, {});

        if (Object.keys(validatePassword(cleanedFormData.password)).length > 0) {
            newErrors.password = validatePassword(cleanedFormData.password);
        }

        setErrors(newErrors);
      
        if (Object.values(newErrors).some((err) => err)) {
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/cadastro', cleanedFormData);
            setMessage({text: res.data.message || 'Usuário registrado com sucesso!', type: 'success' });
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            console.log(error);
            setMessage({text: error.response.data.message || 'Erro no registro', type: 'error'});
        }
    };

    return(
        <div className='flex min-h-full flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-12'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>CRIAR CONTA</h2>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 items-center mx-auto max-w-3xl w-full mt-4 gap-2'>
                <button className="flex items-center justify-center w-full py-2 px-4 border border-red-600 rounded-md text-red-600 text-base" onClick={() => (window.location.href = 'http://localhost:5000/api/auth/google')}>
                    <div className='mr-2'>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="https://www.w3.org/2000/svg" className="IconGoogle"><path fillRule="evenodd" clipRule="evenodd" d="M15.5636 5.89108C14.7529 5.14548 13.3311 4.25327 11.2234 4.25327C8.25644 4.25327 5.73807 6.17041 4.82647 8.82072L4.82662 8.82422C4.60213 9.50865 4.46499 10.2419 4.46499 10.9998C4.46499 11.7575 4.60213 12.4909 4.83909 13.1753L4.8379 13.1762C5.73616 15.8281 8.25533 17.7466 11.2234 17.7466C12.8946 17.7466 14.1668 17.2944 15.1147 16.6466L15.1153 16.6471L15.1154 16.6465C16.6121 15.6199 17.2856 14.0922 17.4103 13.0777H11.2242V8.99558H21.763C21.9251 9.68001 22 10.34 22 11.2444C22 14.5933 20.7777 17.4166 18.6575 19.3355L18.6565 19.3354L18.6567 19.3356C16.7983 21.0222 14.2541 22 11.2234 22C6.83323 22 3.04172 19.5311 1.19588 15.9378L1.19653 15.936C0.436238 14.4452 0 12.7714 0 10.9998C0 9.22791 0.436356 7.55375 1.19684 6.06285L1.19588 6.06212C3.04172 2.46885 6.83322 0 11.2234 0C14.2541 0 16.7859 1.08777 18.7315 2.85998L15.5636 5.89108Z" fill="#EB4335"></path></svg>
                    </div>
                    Cadastrar com o <span className='font-bold ml-1'>Google</span>
                </button>
                <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-400 rounded-md text-black">
                        <span className='font-bold ml-1'>INDISPONÍVEL</span>
                </button>
            </div>
            <div className="relative flex items-center mx-auto max-w-3xl w-full mt-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2 text-gray-400 text-1sm">ou</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className='mt-1 sm:mx-auto sm:w-full sm:max-w-3xl'>
                <form onSubmit={handleRegister} className='space-y-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-3'>
                        <InputField type='text' id="nome" label="Nome completo**" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} error={errors.name} />
                        <InputField type='text' id="cpf" maxLength="13" label="CPF**" value={formData.cpf} onChange={(e) => handleChange('cpf', e.target.value)} error={errors.cpf} />
                        <DropdownField label="Gênero**" options={["Não especificado", "Homem", "Mulher", "Outros"]} selectedOption={selectGender} onSelect={handlerGenderClick}/>
                        <InputField type='text' id="birthDate" label="Data de nascimento**" value={formData.birthDate} onChange={(e) => handleChange("birthDate", e.target.value)} error={errors.birthDate} />
                        <InputField type='text' id="phone" maxLength={13} label="Telefone**" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} error={errors.phone}/>
                        <InputField type='email' id="email" label="E-mail*" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} error={errors.email} />
                        <div className='relative'>
                            <input type={showPassword ? "text" : "password"} id='senha' value={formData.password} onChange={(e) => handleChange("password", e.target.value)} className='peer block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'></input>
                            <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-2 top-3'>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-500" />
                            </button>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-1'>
                                {Object.values(errors.password || {}).map((error, index) => (
                                    <div key={index} className='flex items-center bg-red-200 text-red-500 text-sm px-3 py-1 justify-center'>
                                        <FontAwesomeIcon icon={faXmark} className='text-xl mr-1'/>
                                        <p>{error}</p>
                                    </div>
                                ))}
                            </div>
                            <label htmlFor="senha" className={`absolute left-3 text-gray-500 transition-all duration-200 transform ${formData.password ? 'top-0 text-xs text-blue-500' : 'top-2 text-base'} peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500`}>Crie sua senha</label>
                        </div>
                        <div className='relative'>
                            <input type={showConfirmPassword ? "text" : "password"} id='confirmPassword' value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword",e.target.value)} className='peer block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'></input>
                            <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute right-2 top-3'>
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-gray-500" />
                            </button>
                            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className='text-red-600 mt-1 text-base text-sm sm:text-base'>
                                    <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" /> A confirmaçao de senha não confere.
                                </p>
                            )}
                            <label htmlFor="confirmPassword" className={`absolute left-3 text-gray-500 transition-all duration-200 transform ${formData.confirmPassword ? 'top-0 text-xs text-blue-500' : 'top-2 text-base'} peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500`}>Confirme a senha</label>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <button type='submit' className='w-full py-2 px-4 bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus"ring-blue-500 transition duration-300 max-w-sm'>Registrar</button>
                    </div>
                    <div className='flex justify-center mt-2'>
                        <p className='text-gray-500 mb-9'>
                            Já possui cadastro? <a href='/login' className='font-bold text-orange-600 underline'>ENTRAR</a>
                        </p>
                    </div>
                </form>
                {message && (
                    <div className={`mt-4 text-center p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;