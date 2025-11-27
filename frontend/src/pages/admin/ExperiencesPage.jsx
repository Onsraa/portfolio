import { useState, useEffect } from 'react';
import { Button, Input, Loading } from '@components/ui';
import { experiencesApi } from '@config/api';

function ExperienceForm({ experience, onSave, onCancel }) {
  const [form, setForm] = useState(experience || {
    period: '',
    company: '',
    role: '',
    description: '',
    tech: [],
    is_current: false,
    is_internship: false,
  });
  const [techInput, setTechInput] = useState((experience?.tech || []).join(', '));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        tech: techInput.split(',').map(t => t.trim()).filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: '24px',
      background: '#0d0d0d',
      border: '1px solid #1a1a1a',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Période"
          value={form.period}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
          placeholder="2023 — présent"
          required
        />
        <Input
          label="Entreprise"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Nom de l'entreprise"
          required
        />
      </div>

      <Input
        label="Poste"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        placeholder="Développeur, Ingénieur..."
        required
      />

      <Input
        label="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description du poste..."
        multiline
        rows={3}
      />

      <Input
        label="Technologies (séparées par virgules)"
        value={techInput}
        onChange={(e) => setTechInput(e.target.value)}
        placeholder="Rust, React, Node.js..."
      />

      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={form.is_current}
            onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
          />
          Poste actuel
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={form.is_internship}
            onChange={(e) => setForm({ ...form, is_internship: e.target.checked })}
          />
          Stage/Alternance
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button type="submit" variant="primary" loading={saving}>
          {experience ? 'Mettre à jour' : 'Créer'}
        </Button>
        <Button type="button" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null, 'new', ou id
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const { data } = await experiencesApi.list();
      setExperiences(data.experiences);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await experiencesApi.create(data);
      await loadExperiences();
      setEditing(null);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await experiencesApi.update(editing, data);
      await loadExperiences();
      setEditing(null);
      setEditData(null);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette expérience ?')) return;
    try {
      await experiencesApi.delete(id);
      setExperiences(experiences.filter(e => e.id !== id));
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const startEdit = (exp) => {
    setEditing(exp.id);
    setEditData(exp);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 400, color: '#fff' }}>
          Expériences
        </h1>
        {editing !== 'new' && (
          <Button variant="primary" onClick={() => setEditing('new')}>
            + Nouvelle expérience
          </Button>
        )}
      </div>

      {editing === 'new' && (
        <ExperienceForm
          onSave={handleCreate}
          onCancel={() => setEditing(null)}
        />
      )}

      {editing && editing !== 'new' && (
        <ExperienceForm
          experience={editData}
          onSave={handleUpdate}
          onCancel={() => { setEditing(null); setEditData(null); }}
        />
      )}

      <div style={{ border: '1px solid #1a1a1a', background: '#0d0d0d' }}>
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            style={{
              padding: '20px',
              borderBottom: index < experiences.length - 1 ? '1px solid #1a1a1a' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, color: '#ccc', fontSize: '16px', fontWeight: 400 }}>
                  {exp.role} <span style={{ color: '#444' }}>@</span> {exp.company}
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#555', fontSize: '13px' }}>
                  {exp.period}
                  {exp.is_current && <span style={{ marginLeft: '12px', color: '#5a8a5a' }}>● Actuel</span>}
                  {exp.is_internship && <span style={{ marginLeft: '12px', color: '#5a5a8a' }}>● Stage</span>}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => startEdit(exp)}
                  style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '13px' }}
                >
                  Éditer
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  style={{ background: 'none', border: 'none', color: '#664444', cursor: 'pointer', fontSize: '13px' }}
                >
                  Suppr.
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
