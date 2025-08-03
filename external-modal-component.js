// external-modal-component.js
export default {
  name: 'ExternalModalComponent',
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
      default: ''
    },
    showActions: {
      type: Boolean,
      default: true
    },
    allowEdit: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'light',
      validator: value => ['light', 'dark'].includes(value)
    }
  },
  data() {
    return {
      loading: false,
      editMode: false,
      formData: {},
      errors: {}
    };
  },
  computed: {
    displayTitle() {
      return this.title || this.item?.name || `Detay - ${this.itemId}`;
    },
    hasData() {
      return this.item && Object.keys(this.item).length > 0;
    },
    itemKeys() {
      if (!this.item) return [];
      return Object.keys(this.item).filter(key => 
        !['id', 'date_created', 'date_updated', 'user_created', 'user_updated'].includes(key)
      );
    }
  },
  methods: {
    async saveData() {
      this.loading = true;
      this.errors = {};
      
      try {
        // Form validasyonu
        if (!this.formData.name || this.formData.name.trim() === '') {
          this.errors.name = 'İsim alanı zorunludur';
          return;
        }
        
        if (this.formData.email && !this.isValidEmail(this.formData.email)) {
          this.errors.email = 'Geçerli bir e-posta adresi giriniz';
          return;
        }
        
        // API çağrısı simülasyonu
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Başarılı kaydetme
        this.$emit('action', 'saved', {
          id: this.itemId,
          data: this.formData,
          timestamp: new Date().toISOString()
        });
        
        this.editMode = false;
        this.showSuccessMessage('Veri başarıyla kaydedildi!');
        
      } catch (error) {
        console.error('Kaydetme hatası:', error);
        this.$emit('action', 'error', error);
        this.showErrorMessage('Kaydetme sırasında hata oluştu!');
      } finally {
        this.loading = false;
      }
    },
    
    startEdit() {
      this.editMode = true;
      this.formData = { ...this.item };
      this.errors = {};
    },
    
    cancelEdit() {
      this.editMode = false;
      this.formData = {};
      this.errors = {};
    },
    
    closeModal() {
      this.$emit('close');
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    showSuccessMessage(message) {
      // Başarı mesajı gösterme (console'a yazdır)
      console.log('✅ ' + message);
    },
    
    showErrorMessage(message) {
      // Hata mesajı gösterme (console'a yazdır)
      console.error('❌ ' + message);
    },
    
    formatValue(value) {
      if (value === null || value === undefined) return '-';
      if (typeof value === 'boolean') return value ? 'Evet' : 'Hayır';
      if (typeof value === 'object') return JSON.stringify(value, null, 2);
      return String(value);
    },
    
    getFieldType(value) {
      if (typeof value === 'boolean') return 'boolean';
      if (typeof value === 'number') return 'number';
      if (typeof value === 'object') return 'object';
      if (typeof value === 'string') {
        if (value.includes('@')) return 'email';
        if (value.length > 100) return 'textarea';
        return 'text';
      }
      return 'text';
    }
  },
  template: `
    <div class="external-modal" :class="'theme-' + theme">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-left">
          <h3 class="modal-title">{{ displayTitle }}</h3>
          <div class="modal-subtitle">
            ID: {{ itemId }} | Koleksiyon: {{ collection }}
          </div>
        </div>
        <div class="header-right">
          <button v-if="allowEdit && !editMode" @click="startEdit" class="btn btn-edit">
            ✏️ Düzenle
          </button>
          <button @click="closeModal" class="btn btn-close">
            ✕ Kapat
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>İşlem yapılıyor...</p>
        </div>

        <!-- View Mode -->
        <div v-else-if="!editMode" class="view-mode">
          <div v-if="!hasData" class="no-data">
            <p>Bu öğe için veri bulunamadı.</p>
          </div>
          
          <div v-else class="data-display">
            <div v-for="key in itemKeys" :key="key" class="data-item">
              <label class="data-label">{{ key.replace(/_/g, ' ').toUpperCase() }}:</label>
              <div class="data-value" :class="'type-' + getFieldType(item[key])">
                <span v-if="getFieldType(item[key]) === 'boolean'" class="boolean-value">
                  {{ item[key] ? '✅ Evet' : '❌ Hayır' }}
                </span>
                <span v-else-if="getFieldType(item[key]) === 'object'" class="object-value">
                  <pre>{{ formatValue(item[key]) }}</pre>
                </span>
                <span v-else class="text-value">
                  {{ formatValue(item[key]) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="edit-mode">
          <form @submit.prevent="saveData" class="edit-form">
            <div v-for="key in itemKeys" :key="key" class="form-group">
              <label class="form-label">{{ key.replace(/_/g, ' ').toUpperCase() }}:</label>
              
              <!-- Boolean Field -->
              <select v-if="getFieldType(item[key]) === 'boolean'" v-model="formData[key]" class="form-select">
                <option :value="true">Evet</option>
                <option :value="false">Hayır</option>
              </select>
              
              <!-- Number Field -->
              <input v-else-if="getFieldType(item[key]) === 'number'" 
                     v-model.number="formData[key]" 
                     type="number" 
                     class="form-input" />
              
              <!-- Email Field -->
              <input v-else-if="getFieldType(item[key]) === 'email'" 
                     v-model="formData[key]" 
                     type="email" 
                     class="form-input" />
              
              <!-- Textarea Field -->
              <textarea v-else-if="getFieldType(item[key]) === 'textarea'" 
                        v-model="formData[key]" 
                        class="form-textarea"
                        rows="4"></textarea>
              
              <!-- Default Text Field -->
              <input v-else 
                     v-model="formData[key]" 
                     type="text" 
                     class="form-input" />
              
              <!-- Error Message -->
              <div v-if="errors[key]" class="error-message">
                {{ errors[key] }}
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" :disabled="loading" class="btn btn-primary">
                {{ loading ? '⏳ Kaydediliyor...' : '💾 Kaydet' }}
              </button>
              <button type="button" @click="cancelEdit" class="btn btn-secondary">
                ❌ İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
};
