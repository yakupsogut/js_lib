// beautiful-form-modal.js
export default {
  name: 'BeautifulFormModal',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemId: {
      type: [String, Number],
      required: true
    },
    collection: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'Form Modal'
    },
    theme: {
      type: String,
      default: 'blue',
      validator: value => ['blue', 'green', 'purple', 'orange'].includes(value)
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        name: '',
        email: '',
        phone: '',
        category: '',
        priority: 'medium',
        status: 'active',
        description: '',
        tags: [],
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        preferences: []
      },
      errors: {},
      categories: [
        { value: 'personal', label: 'Kişisel' },
        { value: 'business', label: 'İş' },
        { value: 'education', label: 'Eğitim' },
        { value: 'health', label: 'Sağlık' },
        { value: 'entertainment', label: 'Eğlence' }
      ],
      priorities: [
        { value: 'low', label: 'Düşük', color: '#10b981' },
        { value: 'medium', label: 'Orta', color: '#f59e0b' },
        { value: 'high', label: 'Yüksek', color: '#ef4444' }
      ],
      statuses: [
        { value: 'active', label: 'Aktif', color: '#10b981' },
        { value: 'inactive', label: 'Pasif', color: '#6b7280' },
        { value: 'pending', label: 'Beklemede', color: '#f59e0b' }
      ],
      preferenceOptions: [
        { value: 'newsletter', label: 'Bülten' },
        { value: 'updates', label: 'Güncellemeler' },
        { value: 'marketing', label: 'Pazarlama' },
        { value: 'support', label: 'Destek' }
      ],
      tagOptions: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'API', 'Database', 'Mobile', 'Web']
    };
  },
  computed: {
    displayTitle() {
      return this.title || 'Güzel Form Modal';
    }
  },
  mounted() {
    if (this.item) {
      this.formData = {
        name: this.item.name || '',
        email: this.item.email || '',
        phone: this.item.phone || '',
        category: this.item.category || '',
        priority: this.item.priority || 'medium',
        status: this.item.status || 'active',
        description: this.item.description || '',
        tags: this.item.tags || [],
        notifications: this.item.notifications || {
          email: true,
          sms: false,
          push: true
        },
        preferences: this.item.preferences || []
      };
    }
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.errors = {};
      
      try {
        // Form validasyonu
        if (!this.formData.name.trim()) {
          this.errors.name = 'İsim alanı zorunludur';
        }
        
        if (!this.formData.email.trim()) {
          this.errors.email = 'E-posta alanı zorunludur';
        } else if (!this.isValidEmail(this.formData.email)) {
          this.errors.email = 'Geçerli bir e-posta adresi giriniz';
        }
        
        if (!this.formData.category) {
          this.errors.category = 'Kategori seçimi zorunludur';
        }
        
        if (Object.keys(this.errors).length > 0) {
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.$emit('action', 'saved', {
          id: this.itemId,
          data: this.formData,
          timestamp: new Date().toISOString()
        });
        
        console.log('✅ Form başarıyla kaydedildi!');
        
      } catch (error) {
        console.error('❌ Kaydetme hatası:', error);
        this.$emit('action', 'error', error);
      } finally {
        this.loading = false;
      }
    },
    
    closeModal() {
      this.$emit('close');
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    toggleTag(tag) {
      const index = this.formData.tags.indexOf(tag);
      if (index > -1) {
        this.formData.tags.splice(index, 1);
      } else {
        this.formData.tags.push(tag);
      }
    }
  },
  template: `
    <div class="beautiful-form-modal" :class="'theme-' + theme">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2 class="modal-title">{{ displayTitle }}</h2>
          <p class="modal-subtitle">ID: {{ itemId }} | Koleksiyon: {{ collection }}</p>
        </div>
        <button @click="closeModal" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>Form kaydediliyor...</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="beautiful-form">
          <!-- Row 1: Name & Email -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">👤</span>
                İsim *
              </label>
              <input 
                v-model="formData.name"
                type="text" 
                class="form-input"
                :class="{ 'error': errors.name }"
                placeholder="Adınızı giriniz"
              />
              <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
            </div>
            
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">📧</span>
                E-posta *
              </label>
              <input 
                v-model="formData.email"
                type="email" 
                class="form-input"
                :class="{ 'error': errors.email }"
                placeholder="ornek@email.com"
              />
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>
          </div>

          <!-- Row 2: Phone & Category -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">📱</span>
                Telefon
              </label>
              <input 
                v-model="formData.phone"
                type="tel" 
                class="form-input"
                placeholder="+90 555 123 4567"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">📂</span>
                Kategori *
              </label>
              <select 
                v-model="formData.category"
                class="form-select"
                :class="{ 'error': errors.category }"
              >
                <option value="">Kategori seçiniz</option>
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
              <div v-if="errors.category" class="error-message">{{ errors.category }}</div>
            </div>
          </div>

          <!-- Row 3: Priority & Status -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">⚡</span>
                Öncelik
              </label>
              <div class="radio-group">
                <label v-for="priority in priorities" :key="priority.value" class="radio-item">
                  <input 
                    type="radio" 
                    :value="priority.value"
                    v-model="formData.priority"
                    class="radio-input"
                  />
                  <span class="radio-custom" :style="{ '--color': priority.color }"></span>
                  <span class="radio-label">{{ priority.label }}</span>
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">🏷️</span>
                Durum
              </label>
              <div class="radio-group">
                <label v-for="status in statuses" :key="status.value" class="radio-item">
                  <input 
                    type="radio" 
                    :value="status.value"
                    v-model="formData.status"
                    class="radio-input"
                  />
                  <span class="radio-custom" :style="{ '--color': status.color }"></span>
                  <span class="radio-label">{{ status.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Row 4: Description -->
          <div class="form-group full-width">
            <label class="form-label">
              <span class="label-icon">📝</span>
              Açıklama
            </label>
            <textarea 
              v-model="formData.description"
              class="form-textarea"
              placeholder="Detaylı açıklama giriniz..."
              rows="4"
            ></textarea>
            <div class="char-count">{{ formData.description.length }}/500</div>
          </div>

          <!-- Row 5: Tags -->
          <div class="form-group full-width">
            <label class="form-label">
              <span class="label-icon">🏷️</span>
              Etiketler
            </label>
            <div class="tags-container">
              <div 
                v-for="tag in tagOptions" 
                :key="tag"
                @click="toggleTag(tag)"
                class="tag-item"
                :class="{ 'selected': formData.tags.includes(tag) }"
              >
                {{ tag }}
              </div>
            </div>
          </div>

          <!-- Row 6: Notifications -->
          <div class="form-group full-width">
            <label class="form-label">
              <span class="label-icon">🔔</span>
              Bildirim Tercihleri
            </label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input 
                  type="checkbox" 
                  v-model="formData.notifications.email"
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">E-posta Bildirimleri</span>
              </label>
              
              <label class="checkbox-item">
                <input 
                  type="checkbox" 
                  v-model="formData.notifications.sms"
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">SMS Bildirimleri</span>
              </label>
              
              <label class="checkbox-item">
                <input 
                  type="checkbox" 
                  v-model="formData.notifications.push"
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">Push Bildirimleri</span>
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="submit" :disabled="loading" class="submit-btn">
              <span v-if="loading" class="loading-spinner-small"></span>
              {{ loading ? 'Kaydediliyor...' : '💾 Kaydet' }}
            </button>
            <button type="button" @click="closeModal" class="cancel-btn">
              ❌ İptal
            </button>
          </div>
        </form>
      </div>

      <style>
        /* Modal Container */
        .beautiful-form-modal {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Theme Colors */
        .theme-blue { --primary-color: #3b82f6; --primary-light: #dbeafe; }
        .theme-green { --primary-color: #10b981; --primary-light: #d1fae5; }
        .theme-purple { --primary-color: #8b5cf6; --primary-light: #e9d5ff; }
        .theme-orange { --primary-color: #f59e0b; --primary-light: #fef3c7; }

        /* Header */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px 32px;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          border-radius: 16px 16px 0 0;
        }

        .header-content h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
        }

        .modal-subtitle {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: white;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        /* Content */
        .modal-content {
          padding: 32px;
          position: relative;
        }

        /* Loading Overlay */
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 0 0 16px 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Form */
        .beautiful-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .label-icon {
          font-size: 16px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background: #ffffff;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error,
        .form-select.error {
          border-color: #ef4444;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }

        .char-count {
          text-align: right;
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        /* Radio Buttons */
        .radio-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .radio-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .radio-input {
          display: none;
        }

        .radio-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          position: relative;
          transition: all 0.2s;
        }

        .radio-input:checked + .radio-custom {
          border-color: var(--color);
          background: var(--color);
        }

        .radio-input:checked + .radio-custom::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
        }

        .radio-label {
          font-size: 14px;
          color: #374151;
        }

        /* Checkboxes */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          position: relative;
          transition: all 0.2s;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }

        .checkbox-input:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .checkbox-label {
          font-size: 14px;
          color: #374151;
        }

        /* Tags */
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag-item {
          padding: 6px 12px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: #374151;
        }

        .tag-item:hover {
          background: #e5e7eb;
        }

        .tag-item.selected {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .submit-btn,
        .cancel-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn {
          background: var(--primary-color);
          color: white;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .loading-spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .beautiful-form-modal {
            margin: 16px;
            max-height: calc(100vh - 32px);
          }

          .modal-header {
            padding: 20px 24px;
          }

          .modal-content {
            padding: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .radio-group {
            flex-direction: column;
            gap: 12px;
          }

          .form-actions {
            flex-direction: column;
          }

          .submit-btn,
          .cancel-btn {
            width: 100%;
            justify-content: center;
          }
        }
      </style>
    </div>
  `
};
