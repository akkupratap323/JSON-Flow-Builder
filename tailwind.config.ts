import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for our JSON form builder
				"json-blue": {
					50: "#edf5ff", 
					100: "#dbeafe", 
					200: "#bfdbfe", 
					300: "#93c5fd", 
					400: "#60a5fa", 
					500: "#3b82f6", 
					600: "#2563eb", 
					700: "#1d4ed8", 
					800: "#1e40af", 
					900: "#1e3a8a"
				},
				"json-gray": {
					50: "#f9fafb", 
					100: "#f3f4f6", 
					200: "#e5e7eb", 
					300: "#d1d5db", 
					400: "#9ca3af", 
					500: "#6b7280", 
					600: "#4b5563", 
					700: "#374151", 
					800: "#1f2937", 
					900: "#111827"
				},
				json: {
					gray: {
						50: "hsl(220, 20%, 98%)",
						100: "hsl(220, 15%, 95%)",
						200: "hsl(220, 15%, 91%)",
						300: "hsl(220, 12%, 85%)",
						400: "hsl(220, 10%, 70%)",
						500: "hsl(220, 9%, 55%)",
						600: "hsl(220, 8%, 40%)",
						700: "hsl(220, 7%, 25%)",
						800: "hsl(220, 6%, 15%)",
						900: "hsl(220, 5%, 10%)",
					},
					blue: {
						50: "hsl(216, 100%, 98%)",
						100: "hsl(216, 95%, 95%)",
						200: "hsl(216, 90%, 90%)",
						300: "hsl(216, 85%, 85%)",
						400: "hsl(216, 80%, 70%)",
						500: "hsl(216, 75%, 55%)",
						600: "hsl(216, 70%, 45%)",
						700: "hsl(216, 65%, 35%)",
						800: "hsl(216, 60%, 25%)",
						900: "hsl(216, 55%, 15%)",
					},
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'slide-in': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
					},
				'shake': {
					'10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
					'20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
					'30%, 50%, 70%': { transform: 'translate3d(-3px, 0, 0)' },
					'40%, 60%': { transform: 'translate3d(3px, 0, 0)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.4s ease-out',
				'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
