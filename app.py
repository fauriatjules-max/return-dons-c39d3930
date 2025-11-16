import streamlit as st
import pandas as pd
import requests
from datetime import datetime

# Configuration de la page
st.set_page_config(
    page_title="Donation App - Partage Solidaire",
    page_icon="🎁",
    layout="wide"
)

# CSS personnalisé
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #2E8B57;
        text-align: center;
        margin-bottom: 1rem;
    }
    .donation-card {
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 5px solid #2E8B57;
        background-color: #f8f9fa;
        margin-bottom: 1rem;
    }
    .category-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        color: white;
        font-weight: bold;
        font-size: 0.8rem;
    }
</style>
""", unsafe_allow_html=True)

class DonationApp:
    def __init__(self):
        self.donations = self.get_mock_data()
    
    def get_mock_data(self):
        return [
            {
                "id": 1,
                "title": "Canapé 3 places",
                "description": "Canapé en bon état, quelques marques d'usure",
                "category": "objets",
                "address": "15e arrondissement, Paris",
                "donor": "Marie L.",
                "distance": "500m"
            },
            {
                "id": 2, 
                "title": "Légumes bio du jardin",
                "description": "Courgettes et tomates de mon potager",
                "category": "nourriture",
                "address": "14e arrondissement, Paris", 
                "donor": "Sophie M.",
                "distance": "200m"
            },
            {
                "id": 3,
                "title": "Veste d'hiver chaude",
                "description": "Veste taille M, presque neuve",
                "category": "vetements",
                "address": "13e arrondissement, Paris",
                "donor": "Thomas D.", 
                "distance": "1.2km"
            }
        ]
    
    def get_category_color(self, category):
        colors = {
            'nourriture': '#FF7F50',
            'objets': '#2E8B57',
            'vetements': '#9370DB',
            'electronique': '#4169E1',
            'autre': '#6C757D'
        }
        return colors.get(category, '#6C757D')
    
    def get_category_icon(self, category):
        icons = {
            'nourriture': '🍎',
            'objets': '📦',
            'vetements': '👕',
            'electronique': '💻',
            'autre': '🎁'
        }
        return icons.get(category, '🎁')
    
    def run(self):
        # Header
        st.markdown('<h1 class="main-header">🎁 Donation App</h1>', unsafe_allow_html=True)
        st.markdown("### Donnez une seconde vie à vos objets - Rejoignez la communauté solidaire")
        
        # Sidebar
        with st.sidebar:
            st.header("🔍 Filtres")
            category_filter = st.selectbox("Catégorie", ["Toutes", "nourriture", "objets", "vetements"])
            search_query = st.text_input("Rechercher...")
            
            st.header("📊 Statistiques")
            st.metric("Dons disponibles", len(self.donations))
            st.metric("Membres actifs", "1.2K")
        
        # Section Hero
        col1, col2 = st.columns([2, 1])
        with col1:
            st.subheader("Transformez vos objets en solidarité")
            st.write("Découvrez des dons près de chez vous. Donnez une seconde vie à vos objets.")
            
            col1_1, col1_2 = st.columns(2)
            with col1_1:
                if st.button("🗺️ Explorer les dons", use_container_width=True):
                    st.success("Fonctionnalité à venir!")
            with col1_2:
                if st.button("❤️ Publier un don", use_container_width=True):
                    st.info("Bientôt disponible!")
        
        with col2:
            st.image("https://via.placeholder.com/300x200/2E8B57/FFFFFF?text=Communauté+Solidaire", 
                    caption="Rejoignez notre communauté")
        
        # Liste des dons
        st.markdown("## 🎁 Dons Disponibles")
        
        filtered_donations = self.donations
        if category_filter != "Toutes":
            filtered_donations = [d for d in filtered_donations if d['category'] == category_filter]
        if search_query:
            filtered_donations = [d for d in filtered_donations if search_query.lower() in d['title'].lower()]
        
        for donation in filtered_donations:
            color = self.get_category_color(donation['category'])
            icon = self.get_category_icon(donation['category'])
            
            with st.container():
                st.markdown(f"""
                <div class="donation-card">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <h3 style="margin: 0;">{donation['title']}</h3>
                        <span class="category-badge" style="background-color: {color};">
                            {icon} {donation['category']}
                        </span>
                    </div>
                    <p style="margin: 10px 0; color: #666;">{donation['description']}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: #888;">
                        <span>📍 {donation['address']} ({donation['distance']})</span>
                        <span>par {donation['donor']}</span>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                col_btn1, col_btn2 = st.columns(2)
                with col_btn1:
                    if st.button("👀 Voir", key=f"view_{donation['id']}", use_container_width=True):
                        st.session_state.selected_donation = donation
                with col_btn2:
                    if st.button("💌 Contacter", key=f"contact_{donation['id']}", use_container_width=True):
                        st.success(f"Contactez {donation['donor']} pour {donation['title']}")
                
                st.markdown("---")

# Lancer l'application
if __name__ == "__main__":
    app = DonationApp()
    app.run()
