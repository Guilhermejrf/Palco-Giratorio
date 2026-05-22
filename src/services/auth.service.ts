export const authService = {
  login: async (email: string, password: string) => {
    void password
    return {
      token: 'demo-token',
      user: {
        id: 'user-demo',
        name: email.split('@')[0] || 'Gestor',
        email,
        role: 'gestor_sesc' as const,
        city: 'Recife',
        organization: 'Sesc Pernambuco',
      },
    }
  },
}
