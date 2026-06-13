import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Use standard rules
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  
  // Replace .eslintignore
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**']
  },
  
  // Custom rules
  {
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
);
