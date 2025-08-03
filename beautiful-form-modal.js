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
    },
    priorityColor() {
      const priority = this.priorities.find(p => p.value === this.formData.priority);
      return priority ? priority.color : '#6b7280';
    },
    statusColor() {
      const status = this.statuses.find(s => s.value === this.formData.status);
      return status ? status.color : '#6b7280';
    }
  },
  mounted() {
    // Form verilerini item'dan yükle
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
        
        if (this.formData.phone && !this.isValidPhone(this.formData.phone)) {
          this.errors.phone = 'Geçerli bir telefon numarası giriniz';
        }
        
        if (!this.formData.category) {
          this.errors.category = 'Kategori seçimi zorunludur';
        }
        
        if (this.formData.description.length > 500) {
          this.errors.description = 'Açıklama 500 karakterden uzun olamaz';
        }
        
        // Hata varsa durdur
        if (Object.keys(this.errors).length > 0) {
          return;
        }
        
        // API çağrısı simülasyonu
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Başarılı kaydetme
        this.$emit('action', 'saved', {
          id: this.itemId,
          data: this.formData,
          timestamp: new Date().toISOString()
        });
        
        this.showSuccessMessage('Form başarıyla kaydedildi!');
        
      } catch (error) {
        console.error('Kaydetme hatası:', error);
        this.$emit('action', 'error', error);
        this.showErrorMessage('Kaydetme sırasında hata oluştu!');
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
    
    isValidPhone(phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      return phoneRegex.test(phone);
    },
    
    toggleTag(tag) {
      const index = this.formData.tags.indexOf(tag);
      if (index > -1) {
        this.formData.tags.splice(index, 1);
      } else {
        this.formData.tags.push(tag);
      }
    },
    
    togglePreference(pref) {
      const index = this.formData.preferences.indexOf(pref);
      if (index > -1) {
        this.formData.preferences.splice(index, 1);
      } else {
        this.formData.preferences.push(pref);
      }
    },
    
    showSuccessMessage(message) {
      console.log('✅ ' + message);
    },
    
    showErrorMessage(message) {
      console.error('❌ ' + message);
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
                :class="{ 'error': errors.phone }"
                placeholder="+90 555 123 4567"
              />
              <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
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
              :class="{ 'error': errors.description }"
              placeholder="Detaylı açıklama giriniz..."
              rows="4"
            ></textarea>
            <div class="char-count">{{ formData.description.length }}/500</div>
            <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
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

          <!-- Row 7: Preferences -->
          <div class="form-group full-width">
            <label class="form-label">
              <span class="label-icon">⚙️</span>
              Tercihler
            </label>
            <div class="checkbox-group">
              <label 
                v-for="pref in preferenceOptions" 
                :key="pref.value"
                class="checkbox-item"
              >
                <input 
                  type="checkbox" 
                  :value="pref.value"
                  v-model="formData.preferences"
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">{{ pref.label }}</span>
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
    </div>
  `
};
