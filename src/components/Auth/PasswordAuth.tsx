import { useState } from 'react';
import './PasswordAuth.css';

interface PasswordAuthProps {
  onAuthenticated: () => void;
}

const PasswordAuth = ({ onAuthenticated }: PasswordAuthProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // パスワード（変更可能）
  const CORRECT_PASSWORD = '1203NANA';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      // 認証成功
      localStorage.setItem('cad_authenticated', 'true');
      onAuthenticated();
    } else {
      // 認証失敗
      setError('パスワードが正しくありません');
      setPassword('');
    }
  };

  return (
    <div className="password-auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🔒 3D CAD Suite</h1>
          <p>プライベートアクセス</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="パスワードを入力してください"
              autoFocus
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <button type="submit" className="login-btn">
            ログイン
          </button>
        </form>

        <div className="auth-footer">
          <p>このアプリケーションは認証が必要です</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordAuth;
