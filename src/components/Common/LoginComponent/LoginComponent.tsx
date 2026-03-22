'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Eye, EyeOff } from 'lucide-react';


interface LoginComponentProps {
	mode?: 'modulo' | 'redirect';
}

const LoginComponent: React.FC<LoginComponentProps> = ({ mode = 'modulo' }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	if (mode === 'redirect') {
		return (
			<button
				className="flex items-center gap-2 text-sky-600 font-semibold px-3 py-1 rounded text-xs transition-all hover:text-sky-800 hover:scale-105 focus:outline-none"
				style={{ background: 'none', boxShadow: 'none' }}
				onClick={() => router.push('/login')}
			>
				<User className="w-4 h-4" />
				Iniciar sesión
			</button>
		);
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Aquí puedes manejar el login
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white/80 border border-sky-200 rounded-lg shadow p-3 flex flex-col gap-3 w-56 min-w-[200px] max-w-xs mx-auto items-center"
		>
			<div className="flex flex-col items-center mb-1">
				<User className="w-8 h-8 text-sky-400 mb-1" />
			</div>
			<input
				type="email"
				placeholder="Correo"
				value={email}
				onChange={e => setEmail(e.target.value)}
				className="px-3 py-2 border border-sky-100 rounded-md w-full text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
				required
			/>
			<div className="relative w-full">
				<input
					type={showPassword ? 'text' : 'password'}
					placeholder="Contraseña"
					value={password}
					onChange={e => setPassword(e.target.value)}
					className="px-3 py-2 border border-sky-100 rounded-md w-full text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 pr-8"
					required
				/>
				<button
					type="button"
					className="absolute right-2 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 p-1"
					tabIndex={-1}
					onClick={() => setShowPassword(v => !v)}
				>
					{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
				</button>
			</div>
			<button
				type="submit"
				className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-md text-xs transition-colors w-full mt-1"
			>
				Entrar
			</button>
		</form>
	);
};

export default LoginComponent;
