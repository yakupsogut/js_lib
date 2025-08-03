// my-external-modal.js - CDN'den yüklenebilir
export default {
  name: 'MyExternalModal',
  props: {
    item: Object,
    itemId: [String, Number],
    collection: String,
    title: String,
    showExtraInfo: Boolean,
    allowEdit: Boolean
  },
  data() {
    return {
      loading: false,
      editMode: false,
      formData: {}
    };
  },
  computed: {
    displayTitle() {
      return this.title || this.item?.name || 'Detay Görünümü';
    },
    hasPermissions() {
      return this.item?.permissions && this.item.permissions.length > 0;
    }
  },
  methods: {
    async saveData() {
      this.loading = true;
      try {
        // API çağrısı simülasyonu
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Başarılı kaydetme
        this.$emit('action', 'saved', this.formData);
        this.editMode = false;
        
        // Console'a log
        console.log('Veri kaydedildi:', this.formData);
      } catch (error) {
        console.error('Kaydetme hatası:', error);
        this.$emit('action', 'error', error);
      } finally {
        this.loading = false;
      }
    },
    
    startEdit() {
      this.editMode = true;
      this.formData = { ...this.item };
    },
    
    cancelEdit() {
      this.editMode = false;
      this.formData = {};
    },
    
    closeModal() {
      this.$emit('close');
    }
  },
  template: `
    <div class="external-modal-component">
      <!-- Header -->
      <div class="modal-header">
        <h3>{{ displayTitle }}</h3>
        <div class="header-actions">
          <button v-if="allowEdit && !editMode" @click="startEdit" class="btn btn-edit">
            Düzenle
          </button>
          <button @click="closeModal" class="btn btn-close">
            Kapat
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- View Mode -->
        <div v-if="!editMode" class="view-mode">
          <!-- Basic Info -->
          <div class="info-section">
            <h4>Temel Bilgiler</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>ID:</label>
                <span>{{ itemId }}</span>
              </div>
              <div class="info-item">
                <label>Koleksiyon:</label>
                <span>{{ collection }}</span>
              </div>
              <div v-if="item?.name" class="info-item">
                <label>İsim:</label>
                <span>{{ item.name }}</span>
              </div>
              <div v-if="item?.email" class="info-item">
                <label>E-posta:</label>
                <span>{{ item.email }}</span>
              </div>
              <div v-if="item?.status" class="info-item">
                <label>Durum:</label>
                <span class="status-badge" :class="'status-' + item.status">
                  {{ item.status === 'active' ? 'Aktif' : 'Pasif' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Extra Info -->
          <div v-if="showExtraInfo && item?.description" class="info-section">
            <h4>Açıklama</h4>
            <p>{{ item.description }}</p>
          </div>

          <!-- Permissions -->
          <div v-if="hasPermissions" class="info-section">
            <h4>İzinler</h4>
            <div class="permissions-list">
              <div v-for="permission in item.permissions" :key="permission.id" class="permission-item">
                <span class="permission-name">{{ permission.name }}</span>
                <span v-if="permission.description" class="permission-desc">
                  {{ permission.description }}
                </span>
              </div>
            </div>
          </div>

          <!-- Custom Data -->
          <div v-if="item?.customData" class="info-section">
            <h4>Özel Veriler</h4>
            <pre class="json-display">{{ JSON.stringify(item.customData, null, 2) }}</pre>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="edit-mode">
          <form @submit.prevent="saveData">
            <div class="form-group">
              <label>İsim:</label>
              <input v-model="formData.name" type="text" class="form-input" />
            </div>
            
            <div class="form-group">
              <label>E-posta:</label>
              <input v-model="formData.email" type="email" class="form-input" />
            </div>
            
            <div class="form-group">
              <label>Durum:</label>
              <select v-model="formData.status" class="form-select">
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Açıklama:</label>
              <textarea v-model="formData.description" class="form-textarea"></textarea>
            </div>
            
            <div class="form-actions">
              <button type="submit" :disabled="loading" class="btn btn-primary">
                {{ loading ? 'Kaydediliyor...' : 'Kaydet' }}
              </button>
              <button type="button" @click="cancelEdit" class="btn btn-secondary">
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
};
