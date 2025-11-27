import { useState, useEffect } from 'react';
import { Button, Input, Loading } from '@components/ui';
import { settingsApi } from '@config/api';
import { useAuth } from '@context/AuthContext';

export default function SettingsPage() {
  const { changePassword } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await settingsApi.list();
      setSettings(data.settings);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await settingsApi.update(settings);
      alert('Paramètres sauvegardés !');
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    const result = await changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (result.success) {
      setPasswordSuccess('Mot de passe modifié !');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordError(result.error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ margin: '0 0 32px 0', fontSize: '24px', fontWeight: 400, color: '#fff' }}>
        Paramètres
      </h1>

      {/* Informations du site */}
      <section style={{
        padding: '24px',
        marginBottom: '24px',
        background: '#0d0d0d',
        border: '1px solid #1a1a1a',
      }}>
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: '14px',
          fontWeight: 400,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Informations du site
        </h2>

        <Input
          label="Nom"
          value={settings.site_name || ''}
          onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
          placeholder="Votre nom"
        />

        <Input
          label="Titre"
          value={settings.site_title || ''}
          onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
          placeholder="Développeur Rust"
        />

        <Input
          label="Description"
          value={settings.site_description || ''}
          onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
          placeholder="Courte bio..."
          multiline
          rows={3}
        />

        <Button onClick={handleSaveSettings} loading={saving} variant="primary">
          Sauvegarder
        </Button>
      </section>

      {/* Liens */}
      <section style={{
        padding: '24px',
        marginBottom: '24px',
        background: '#0d0d0d',
        border: '1px solid #1a1a1a',
      }}>
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: '14px',
          fontWeight: 400,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Liens sociaux
        </h2>

        <Input
          label="GitHub"
          value={settings.github_url || ''}
          onChange={(e) => setSettings({ ...settings, github_url: e.target.value })}
          placeholder="https://github.com/..."
        />

        <Input
          label="LinkedIn"
          value={settings.linkedin_url || ''}
          onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
          placeholder="https://linkedin.com/in/..."
        />

        <Input
          label="Email"
          value={settings.email || ''}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          placeholder="votre@email.com"
        />

        <Input
          label="CV (URL)"
          value={settings.cv_url || ''}
          onChange={(e) => setSettings({ ...settings, cv_url: e.target.value })}
          placeholder="/cv.pdf"
        />

        <Button onClick={handleSaveSettings} loading={saving} variant="primary">
          Sauvegarder
        </Button>
      </section>

      {/* Sécurité */}
      <section style={{
        padding: '24px',
        background: '#0d0d0d',
        border: '1px solid #1a1a1a',
      }}>
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: '14px',
          fontWeight: 400,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Changer le mot de passe
        </h2>

        {passwordError && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            background: '#1a1111',
            border: '1px solid #331111',
            color: '#aa4444',
            fontSize: '13px',
          }}>
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            background: '#111a11',
            border: '1px solid #113311',
            color: '#44aa44',
            fontSize: '13px',
          }}>
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <Input
            label="Mot de passe actuel"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            required
          />

          <Input
            label="Nouveau mot de passe"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            required
          />

          <Button type="submit" variant="primary">
            Changer le mot de passe
          </Button>
        </form>
      </section>
    </div>
  );
}
