import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Loading } from '@components/ui';
import { articlesApi, uploadsApi } from '@config/api';

// Composant pour éditer un bloc
function ContentBlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const { data } = await uploadsApi.upload(file);
      onChange({ ...block, url: data.image.url });
    } catch (err) {
      alert('Erreur upload: ' + err.message);
    } finally {
      setImageUploading(false);
    }
  };

  const blockStyles = {
    padding: '16px',
    marginBottom: '12px',
    background: '#111',
    border: '1px solid #222',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '11px',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#0d0d0d',
    border: '1px solid #222',
    color: '#e0e0e0',
    fontSize: '14px',
    fontFamily: 'inherit',
  };

  return (
    <div style={blockStyles}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <span style={{
          fontSize: '11px',
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          {block.type}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            style={{
              background: 'none',
              border: 'none',
              color: isFirst ? '#333' : '#666',
              cursor: isFirst ? 'default' : 'pointer',
              fontSize: '12px',
            }}
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            style={{
              background: 'none',
              border: 'none',
              color: isLast ? '#333' : '#666',
              cursor: isLast ? 'default' : 'pointer',
              fontSize: '12px',
            }}
          >
            ↓
          </button>
          <button
            onClick={onDelete}
            style={{
              background: 'none',
              border: 'none',
              color: '#664444',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {block.type === 'paragraph' && (
        <textarea
          value={block.content || ''}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Écrivez votre paragraphe..."
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      )}

      {block.type === 'heading' && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={block.level || 2}
            onChange={(e) => onChange({ ...block, level: parseInt(e.target.value) })}
            style={{ ...inputStyle, width: '80px' }}
          >
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
          </select>
          <input
            type="text"
            value={block.content || ''}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            placeholder="Titre de section..."
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
      )}

      {block.type === 'code' && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Langage</label>
            <input
              type="text"
              value={block.language || ''}
              onChange={(e) => onChange({ ...block, language: e.target.value })}
              placeholder="javascript, rust, python..."
              style={{ ...inputStyle, width: '200px' }}
            />
          </div>
          <textarea
            value={block.content || ''}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            placeholder="// Votre code ici..."
            rows={8}
            style={{
              ...inputStyle,
              fontFamily: 'monospace',
              fontSize: '13px',
              resize: 'vertical',
            }}
          />
        </>
      )}

      {block.type === 'quote' && (
        <textarea
          value={block.content || ''}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Citation..."
          rows={3}
          style={{ ...inputStyle, fontStyle: 'italic', resize: 'vertical' }}
        />
      )}

      {block.type === 'image' && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Image</label>
            {block.url ? (
              <div>
                <img
                  src={block.url}
                  alt={block.alt || ''}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    marginBottom: '8px',
                    border: '1px solid #222',
                  }}
                />
                <button
                  onClick={() => onChange({ ...block, url: '' })}
                  style={{
                    background: 'none',
                    border: '1px solid #333',
                    color: '#666',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Changer l'image
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  style={{ display: 'none' }}
                  id={`image-upload-${block.id}`}
                />
                <label
                  htmlFor={`image-upload-${block.id}`}
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: '#0d0d0d',
                    border: '1px dashed #333',
                    color: '#666',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {imageUploading ? 'Upload...' : '+ Choisir une image'}
                </label>
              </div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Texte alternatif</label>
            <input
              type="text"
              value={block.alt || ''}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
              placeholder="Description de l'image..."
              style={inputStyle}
            />
          </div>
        </>
      )}

      {block.type === 'list' && (
        <div>
          <label style={labelStyle}>Éléments (un par ligne)</label>
          <textarea
            value={(block.items || []).join('\n')}
            onChange={(e) => onChange({
              ...block,
              items: e.target.value.split('\n'),
            })}
            placeholder="Premier élément&#10;Deuxième élément&#10;Troisième élément"
            rows={5}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <span style={{ fontSize: '11px', color: '#444', marginTop: '4px', display: 'block' }}>
            Les lignes vides seront ignorées à l'affichage
          </span>
        </div>
      )}
    </div>
  );
}

export default function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: [],
    cover_image: '',
    tags: [],
    is_published: false,
  });
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (!isNew) {
      loadArticle();
    }
  }, [id]);

  const loadArticle = async () => {
    try {
      // On utilise l'ID pour récupérer l'article en mode admin
      const { data } = await articlesApi.list({ page: 1, limit: 100 });
      const found = data.articles.find(a => a.id === parseInt(id));
      if (found) {
        setArticle(found);
        setTagsInput((found.tags || []).join(', '));
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      // Nettoyer le contenu avant sauvegarde
      const cleanedContent = article.content.map(block => {
        if (block.type === 'list') {
          return {
            ...block,
            items: (block.items || []).filter(item => item.trim() !== ''),
          };
        }
        return block;
      });

      const data = {
        ...article,
        content: cleanedContent,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        is_published: publish ? true : article.is_published,
      };

      if (isNew) {
        const { data: result } = await articlesApi.create(data);
        navigate(`/admin/articles/${result.article.id}`);
      } else {
        await articlesApi.update(id, data);
      }

      alert(publish ? 'Article publié !' : 'Article sauvegardé !');
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: '',
    };

    if (type === 'heading') newBlock.level = 2;
    if (type === 'list') newBlock.items = [];
    if (type === 'image') {
      newBlock.url = '';
      newBlock.alt = '';
    }

    setArticle({
      ...article,
      content: [...article.content, newBlock],
    });
  };

  const updateBlock = (index, newBlock) => {
    const newContent = [...article.content];
    newContent[index] = newBlock;
    setArticle({ ...article, content: newContent });
  };

  const deleteBlock = (index) => {
    const newContent = article.content.filter((_, i) => i !== index);
    setArticle({ ...article, content: newContent });
  };

  const moveBlock = (index, direction) => {
    const newContent = [...article.content];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newContent.length) return;
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    setArticle({ ...article, content: newContent });
  };

  if (loading) return <Loading />;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: 400,
          color: '#fff',
        }}>
          {isNew ? 'Nouvel article' : 'Éditer l\'article'}
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={() => handleSave(false)} loading={saving}>
            Sauvegarder
          </Button>
          {!article.is_published && (
            <Button variant="primary" onClick={() => handleSave(true)} loading={saving}>
              Publier
            </Button>
          )}
        </div>
      </div>

      {/* Métadonnées */}
      <div style={{
        padding: '24px',
        marginBottom: '24px',
        background: '#0d0d0d',
        border: '1px solid #1a1a1a',
      }}>
        <Input
          label="Titre"
          value={article.title}
          onChange={(e) => setArticle({ ...article, title: e.target.value })}
          placeholder="Titre de l'article"
          required
        />

        <Input
          label="Slug (URL)"
          value={article.slug}
          onChange={(e) => setArticle({ ...article, slug: e.target.value })}
          placeholder="mon-article (généré automatiquement si vide)"
        />

        <Input
          label="Extrait"
          value={article.excerpt}
          onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
          placeholder="Court résumé de l'article..."
          multiline
          rows={2}
        />

        <Input
          label="Tags (séparés par des virgules)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="rust, programmation, tutoriel"
        />
      </div>

      {/* Contenu */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          fontWeight: 400,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Contenu
        </h2>

        {article.content.map((block, index) => (
          <ContentBlockEditor
            key={block.id || index}
            block={block}
            onChange={(newBlock) => updateBlock(index, newBlock)}
            onDelete={() => deleteBlock(index)}
            onMoveUp={() => moveBlock(index, -1)}
            onMoveDown={() => moveBlock(index, 1)}
            isFirst={index === 0}
            isLast={index === article.content.length - 1}
          />
        ))}

        {/* Boutons d'ajout */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          padding: '16px',
          background: '#0d0d0d',
          border: '1px dashed #222',
        }}>
          <span style={{ color: '#444', fontSize: '12px', marginRight: '8px' }}>
            Ajouter:
          </span>
          {['paragraph', 'heading', 'image', 'code', 'quote', 'list'].map((type) => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid #333',
                color: '#666',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              + {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
