import { useState, useEffect } from 'react';
import { Button, Input, Loading } from '@components/ui';
import { projectsApi } from '@config/api';

function ProjectForm({ project, onSave, onCancel }) {
  const [form, setForm] = useState(project || {
    project_id: '',
    title: '',
    description: '',
    tech: [],
    year: new Date().getFullYear().toString(),
    link: '',
    is_featured: false,
  });
  const [techInput, setTechInput] = useState((project?.tech || []).join(', '));
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
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px', gap: '16px' }}>
        <Input
          label="ID"
          value={form.project_id}
          onChange={(e) => setForm({ ...form, project_id: e.target.value })}
          placeholder="001"
        />
        <Input
          label="Titre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Nom du projet"
          required
        />
        <Input
          label="Année"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          placeholder="2025"
        />
      </div>

      <Input
        label="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description du projet..."
        multiline
        rows={3}
      />

      <Input
        label="Technologies (séparées par virgules)"
        value={techInput}
        onChange={(e) => setTechInput(e.target.value)}
        placeholder="Rust, Bevy, WebAssembly..."
      />

      <Input
        label="Lien GitHub/Demo"
        value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })}
        placeholder="https://github.com/..."
      />

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          Projet mis en avant
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button type="submit" variant="primary" loading={saving}>
          {project ? 'Mettre à jour' : 'Créer'}
        </Button>
        <Button type="button" onClick={onCancel}>Annuler</Button>
      </div>
    </form>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await projectsApi.list();
      setProjects(data.projects);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await projectsApi.create(data);
      await loadProjects();
      setEditing(null);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await projectsApi.update(editing, data);
      await loadProjects();
      setEditing(null);
      setEditData(null);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return;
    try {
      await projectsApi.delete(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
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
          Projets
        </h1>
        {editing !== 'new' && (
          <Button variant="primary" onClick={() => setEditing('new')}>
            + Nouveau projet
          </Button>
        )}
      </div>

      {editing === 'new' && (
        <ProjectForm onSave={handleCreate} onCancel={() => setEditing(null)} />
      )}

      {editing && editing !== 'new' && (
        <ProjectForm
          project={editData}
          onSave={handleUpdate}
          onCancel={() => { setEditing(null); setEditData(null); }}
        />
      )}

      <div style={{ border: '1px solid #1a1a1a', background: '#0d0d0d' }}>
        {projects.map((proj, index) => (
          <div
            key={proj.id}
            style={{
              padding: '20px',
              borderBottom: index < projects.length - 1 ? '1px solid #1a1a1a' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, color: '#ccc', fontSize: '16px', fontWeight: 400 }}>
                  <span style={{ color: '#444', marginRight: '12px' }}>{proj.project_id}</span>
                  {proj.title}
                  {proj.is_featured && <span style={{ marginLeft: '12px', color: '#8a8a5a' }}>★</span>}
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#555', fontSize: '13px' }}>
                  {proj.year} · {proj.tech?.join(', ')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setEditing(proj.id); setEditData(proj); }}
                  style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '13px' }}
                >
                  Éditer
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
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
