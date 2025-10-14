import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  const [emailCpf, setEmailCpf] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailCpfError, setEmailCpfError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();

    if (!emailCpf || password.length < 8) return;

    try {
      await axios.post(`${apiUrl}/api/auth/login`, { emailCpf, password }, { withCredentials: true });

      navigate('/');
    } catch (error) {
      setMessage('Erro no login. Tente novamente.');
    }
  };

  const handleEmailCpfChange = e => {
    const value = e.target.value;
    setEmailCpf(value);
    if (!value) {
      setEmailCpfError('E-mail ou CPF informado é inválido.');
    } else {
      setEmailCpfError('');
    }
  };

  const handlePasswordChange = e => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 8) {
      setPasswordError('O campo de "Senha" deve ter ao menos 8 dígitos.');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-6 sm:px-8 mt-16">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">ACESSE SUA CONTA</h2>
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-1">
          <div className="relative">
            <label htmlFor="emailCpf" className="text-sm font-medium text-gray-400">
              {' '}
              E-mail ou CPF{' '}
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-3 left-0 pl-3 flext items-center text-gray-400">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                id="emailCpf"
                name="emailCpf"
                value={emailCpf}
                onChange={handleEmailCpfChange}
                className="block w-full px-3 py-3 pl-8 border border-gray-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            {emailCpfError && <p className="text-sm text-red-600 mt-1">{emailCpfError}</p>}
          </div>
          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-400">
              {' '}
              Senha{' '}
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-3 left-0 pl-3 flext items-center text-gray-400">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className="block w-full px-3 py-3 pl-8 border border-gray-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-3">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-500" />
              </button>
            </div>
            {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
          </div>
          <div className="text-red-600 py-1 pb-2">{message && <p>{message}</p>}</div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-md sm:text-xl font-medium border border-transparent shadow-sm text-white bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <span className="flext items-center justify-center">
                <span className="mr-2 font-bold">ENTRAR</span>
              </span>
            </button>
          </div>
          <div className="flex justify-end">
            <a href="/" className="text-sm font-bold underline text-gray-400">
              Esqueceu a senha?
            </a>
          </div>
        </form>
        <div className="mt-4 flex items-center">
          <div className="w-full border-t border-gray-300" />
          <span className="px-4 text-sm text-gray-400">OU</span>
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="flex items-center justify-center mt-2 text-gray-400 font-bold">
          <p>Quero acessar com minhas redes sociais</p>
        </div>
        <div className="mt-4">
          <button
            className="flex items-center justify-center w-full py-2 px-4 border border-red-600 rounded-sm text-red-600 text-base mb-2"
            onClick={() => (window.location.href = 'http://localhost:5000/api/auth/google')}
          >
            <div className="mr-2">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="https://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.5636 5.89108C14.7529 5.14548 13.3311 4.25327 11.2234 4.25327C8.25644 4.25327 5.73807 6.17041 4.82647 8.82072L4.82662 8.82422C4.60213 9.50865 4.46499 10.2419 4.46499 10.9998C4.46499 11.7575 4.60213 12.4909 4.83909 13.1753L4.8379 13.1762C5.73616 15.8281 8.25533 17.7466 11.2234 17.7466C12.8946 17.7466 14.1668 17.2944 15.1147 16.6466L15.1153 16.6471L15.1154 16.6465C16.6121 15.6199 17.2856 14.0922 17.4103 13.0777H11.2242V8.99558H21.763C21.9251 9.68001 22 10.34 22 11.2444C22 14.5933 20.7777 17.4166 18.6575 19.3355L18.6565 19.3354L18.6567 19.3356C16.7983 21.0222 14.2541 22 11.2234 22C6.83323 22 3.04172 19.5311 1.19588 15.9378L1.19653 15.936C0.436238 14.4452 0 12.7714 0 10.9998C0 9.22791 0.436356 7.55375 1.19684 6.06285L1.19588 6.06212C3.04172 2.46885 6.83322 0 11.2234 0C14.2541 0 16.7859 1.08777 18.7315 2.85998L15.5636 5.89108Z"
                  fill="#EB4335"
                ></path>
              </svg>
            </div>
            <span className="font-bold ml-1">Google</span>
          </button>
          <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-400 rounded-md text-black">
            <span className="font-bold ml-1">INDISPONÍVEL</span>
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Novo no SITE?{' '}
            <Link to="/cadastro" className="text-orange-600 underline">
              CADASTRE-SE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
