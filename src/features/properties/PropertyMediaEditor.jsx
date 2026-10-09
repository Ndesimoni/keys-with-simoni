import React, { useState } from 'react';
import { makeMediaAsset, mediaPhotos, mediaPlans } from '../../lib/media.js';
import { MAX_MEDIA_TOTAL } from '../../config/storage.js';
import { Icon } from '../../components/ui/Icon.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { AMENITIES } from '../../config/properties.js';
import { amenityList } from '../../lib/properties.js';
import { OverflowList } from '../../components/ui/OverflowList.jsx';

export function PropertyMediaEditor({ form, setForm, uploading, setUploading }) {
  const [mediaError, setMediaError] = useState('');
  async function addMedia(e, kind) {
    const input = e.currentTarget;
    const selected = Array.from(input.files || []);
    if (!selected.length) return;
    const field = kind === 'photo' ? 'media_photos' : 'media_floorplans';
    const max = kind === 'photo' ? 8 : 3;
    const current = Array.isArray(form[field]) ? form[field] : [];
    if (current.length + selected.length > max) {
      setMediaError(`Maximum ${max} ${kind === 'photo' ? 'photos' : 'floor plans'} per property.`);
      input.value = '';
      return;
    }
    setUploading(true);
    setMediaError('');
    try {
      const assets = [];
      for (const file of selected) assets.push(await makeMediaAsset(file, kind));
      const updated = [...current, ...assets];
      if (JSON.stringify({ ...form, [field]: updated }).length > MAX_MEDIA_TOTAL / 1.6)
        throw Error('Media exceeds the browser limit. Try fewer or smaller files.');
      setForm((p) => ({ ...p, [field]: updated }));
    } catch (err) {
      setMediaError(err.message);
    } finally {
      setUploading(false);
      input.value = '';
    }
  }
  function removeMedia(key, index) {
    setForm((p) => ({ ...p, [key]: (p[key] || []).filter((_, i) => i !== index) }));
  }
  return (
    <section className="editor-media">
      <div className="editor-media-heading">
        <div>
          <span className="eyebrow">LISTING PRESENTATION</span>
          <h3>Photos & floor plans</h3>
          <p>Make your property attractive, complete and easy to share.</p>
        </div>
        <Badge tone="slate">Browser storage</Badge>
      </div>
      <OverflowList
        mode="all"
        items={mediaPhotos(form)}
        label="Property photos"
        listClassName="editor-photo-grid"
        renderItem={(file, i) => (
          <div className="editor-photo">
            <img src={file.src} alt={file.name} />
            {i === 0 && <span className="cover-marker">Cover photo</span>}
            <button
              type="button"
              aria-label={`Remove photo ${i + 1}`}
              onClick={() => removeMedia('media_photos', i)}
            >
              <Icon name="close" size={14} />
            </button>
            {i > 0 && (
              <button
                type="button"
                className="make-cover"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    media_photos: [p.media_photos[i], ...p.media_photos.filter((_, j) => j !== i)],
                  }))
                }
              >
                Set cover
              </button>
            )}
          </div>
        )}
        after={
          <label className="media-upload-tile">
            <Icon name="image" size={22} />
            <strong>{uploading ? 'Processing...' : 'Add photos'}</strong>
            <small>JPG, PNG, WebP · up to 8</small>
            <input
              aria-label="Upload property photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploading}
              onChange={(e) => addMedia(e, 'photo')}
            />
          </label>
        }
      />
      <div className="editor-floorplans">
        <div className="editor-subheading">
          <Icon name="layers" size={17} /> Floor plans <span>Up to 3 files</span>
        </div>
        {mediaPlans(form).map((file, i) => (
          <div className="editor-plan" key={i}>
            <Icon name={file.type === 'application/pdf' ? 'note' : 'image'} size={16} />
            <span>{file.name}</span>
            <button
              type="button"
              aria-label={`Remove floor plan ${i + 1}`}
              onClick={() => removeMedia('media_floorplans', i)}
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        ))}
        <label className="media-attach-button">
          <Icon name="plus" size={16} /> Add floor plan (image or PDF)
          <input
            aria-label="Upload floor plans"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            multiple
            disabled={uploading}
            onChange={(e) => addMedia(e, 'plan')}
          />
        </label>
      </div>
      {mediaError && (
        <p className="media-warning" role="alert">
          {mediaError}
        </p>
      )}
      <p className="media-note">
        Files are optimized for local storage. Use “Full backup with photos” in Data & export;
        standard Excel export includes listing text only.
      </p>
      <div className="amenity-picker">
        <strong>Quick-add amenities</strong>
        <OverflowList
          mode="scroll"
          className="amenity-options-list"
          items={AMENITIES}
          getKey={(name) => name}
          label="Amenity options"
          listClassName="amenity-chip-list"
          renderItem={(name) => (
            <button
              type="button"
              className={amenityList(form).includes(name) ? 'checked' : ''}
              aria-pressed={amenityList(form).includes(name)}
              onClick={() =>
                setForm((p) => {
                  const a = amenityList(p);
                  return {
                    ...p,
                    amenities: (a.includes(name) ? a.filter((x) => x !== name) : [...a, name]).join(
                      ', ',
                    ),
                  };
                })
              }
            >
              {amenityList(form).includes(name) && <Icon name="check" size={12} />} {name}
            </button>
          )}
        />
      </div>
    </section>
  );
}
