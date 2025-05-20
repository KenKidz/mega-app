import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    // Track if sidebar is expanded or collapsed in desktop view
    isExpanded: true,
    
    // Track if sidebar is open in mobile view
    isMobileOpen: false,
    
    // Track if we're in mobile view
    isMobileView: false
  }),
  
  actions: {
    /**
     * Toggle sidebar state based on current view (mobile or desktop)
     */
    toggleSidebar() {
      if (this.isMobileView) {
        this.isMobileOpen = !this.isMobileOpen;
      } else {
        this.isExpanded = !this.isExpanded;
      }
    },
    
    /**
     * Close sidebar on mobile
     */
    closeMobileSidebar() {
      if (this.isMobileView) {
        this.isMobileOpen = false;
      }
    },
    
    /**
     * Update mobile view state based on screen width
     */
    checkMobileView() {
      const wasMobile = this.isMobileView;
      if (process.client) {
        this.isMobileView = window.innerWidth < 768;
        
        // Auto-close sidebar when resizing to mobile
        if (!wasMobile && this.isMobileView) {
          this.isMobileOpen = false;
        }
      }
    },
    
    /**
     * Initialize event listeners
     */
    initializeListeners() {
      if (process.client) {
        this.checkMobileView();
        window.addEventListener('resize', this.checkMobileView.bind(this));
      }
    },
    
    /**
     * Remove event listeners
     */
    removeListeners() {
      if (process.client) {
        window.removeEventListener('resize', this.checkMobileView.bind(this));
      }
    }
  }
});