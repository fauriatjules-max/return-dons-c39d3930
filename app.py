import streamlit as st
import requests
import json
import pandas as pd
from datetime import datetime
import math

# Configuration de la page
st.set_page_config(
    page_title="Donation App - Partage Solidaire",
    page_icon="🎁",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personnalisé pour reproduire votre design Lovable
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #2E8B57;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #6C757D;
        text-align: center;
        margin-bottom: 2rem;
    }
    .donation-card {
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 5px solid #2E8B57;
        background-color: #f8f9fa;
        margin-bottom: 1rem;
        transition: transform 0.2s;
    }
    .donation-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .category-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        color: white;
        font-weight: bold;
        font-size: 0.8rem;
    }
    .stats-card {
        background: linear-gradient(135deg, #2E8B57 0%, #3DA56A 100%);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

class DonationApp:
    def __init__(self):
        # Vous pouvez remplacer cette URL par votre backend Lovable plus tard
        self.api_url = "https://votre-backend-lovable.app/api"
        
    def get_mock_data(self):
        """Données simulées en attendant votre backend"""
        return {
            "categories": [
                {"id": 1, "name": "nourriture", "display_name": "Nourriture", "color": "#FF7F50", "icon": "🍎"},
                {"id": 2, "name": "objets", "display_name": "Objets", "color": "#2E8B57", "icon": "📦"},
                {"id": 3, "name": "vetements", "display_name": "Vêtements", "color": "#9370DB", "icon": "👕"},
                {"id": 4, "name": "electronique", "display_name": "Électronique", "color": "#4169E1", "icon": "💻"},
                {"id": 5, "name": "autre", "display_name": "Autre", "color": "#6C757D", "icon": "🎁"}
            ],
            "donations": [
                {
                    "id": 1,
                    "title": "Canapé 3 places",
                    "description": "Canapé en bon état, quelques marques d'usure. Dimensions: 200x90cm. À récupérer sur place.",
                    "category": "objets",
                    "status": "disponible",
                    "condition": "bon",
                    "location": {"address": "15e arrondissement, Paris", "coordinates": [2.2976, 48.8412]},
                    "donor": {"username": "Marie L.", "rating": 4.8},
                    "images": [],
                    "created_at": "2024-01-15T10:30:00Z",
                    "likes_count": 12,
                    "views": 45
                },
                {
                    "id": 2,
                    "title": "Légumes bio du jardin",
                    "description": "Courgettes et tomates de mon potager. Production maison sans pesticides.",
                    "category": "nourriture",
                    "status": "disponible", 
                    "condition": "excellent",
                    "location": {"address": "14e arrondissement, Paris", "coordinates": [2.3265, 48.8331]},
                    "donor": {"username": "Sophie M.", "rating": 4.9},
                    "images": [],
                    "created_at": "2024-01-15T08:15:00Z",
                    "likes_count": 8,
                    "views": 32
                },
                {
                    "id": 3,
                    "title": "Veste d'hiver chaude",
                    "description": "Veste taille M, portée seulement 2 fois. Très chaude pour l'hiver.",
                    "category": "vetements",
                    "status": "disponible",
                    "condition": "excellent",
                    "location": {"address": "13e arrondissement, Paris", "coordinates": [2.3555, 48.8289]},
                    "donor": {"username": "Thomas D.", "rating": 4.7},
                    "images": [],
                    "created_at": "2024-01-14T16:45:00Z", 
                    "likes_count": 15,
                    "views": 67
                },
                {
                    "id": 4,
                    "title": "Ordinateur portable",
                    "description": "PC portable Dell, i5, 8GB RAM. Fonctionne parfaitement, écran 15 pouces.",
                    "category": "electronique", 
                    "status": "disponible",
                    "condition": "bon",
                    "location": {"address": "11e arrondissement, Paris", "coordinates": [2.3795, 48.8575]},
                    "donor": {"username": "Pierre K.", "rating": 4.6},
                    "images": [],
                    "created_at": "2024-01-14T14:20:00Z",
                    "likes_count": 23,
                    "views": 89
                }
            ],
            "stats": {
                "total_donations": 156,
                "active_users": 1247,
                "co2_saved": "2.5T",
                "satisfaction_rate": "95%"
            }
        }
    
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
    
    def display_hero_section(self):
        """Section Hero comme dans Lovable"""
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown('<h1 class="main-header">Transformez vos objets en <span style="color:#2E8B57;">solidarité</span></h1>', unsafe_allow_html=True)
            st.markdown('<p class="sub-header">Découvrez des dons près de chez vous. Donnez une seconde vie à vos objets. Rejoignez une communauté engagée pour un monde plus durable.</p>', unsafe_allow_html=True)
            
            col1_1, col1_2 = st.columns(2)
            with col1_1:
                if st.button("🗺️ Explorer la carte", use_container_width=True, type="primary"):
                    st.session_state.current_page = "map"
            with col1_2:
                if st.button("❤️ Publier un don", use_container_width=True):
                    st.session_state.current_page = "publish"
        
        with col2:
            # Placeholder pour une image
            st.image("https://via.placeholder.com/400x250/2E8B57/FFFFFF?text=Communauté+Solidaire", 
                    caption="Rejoignez notre communauté de partage")
    
    def display_stats_section(self, stats):
        """Section statistiques"""
        st.markdown("---")
        st.subheader("📊 Notre Impact Collectif")
        
        cols = st.columns(4)
        metrics = [
            (f"{stats['total_donations']}+", "Dons partagés"),
            (f"{stats['active_users']}+", "Membres actifs"), 
            (stats['co2_saved'], "CO2 économisé"),
            (stats['satisfaction_rate'], "Satisfaction")
        ]
        
        for col, (value, label) in zip(cols, metrics):
            with col:
                st.markdown(f"""
                <div class="stats-card">
                    <div style="font-size: 2rem; font-weight: bold;">{value}</div>
                    <div>{label}</div>
                </div>
                """, unsafe_allow_html=True)
    
    def display_donations_grid(self, donations, categories):
        """Grille de dons"""
        st.markdown("---")
        st.subheader("🎁 Dons Récents près de chez vous")
        
        # Filtres
        col1, col2, col3 = st.columns([2, 1, 1])
        with col1:
            search_query = st.text_input("🔍 Rechercher un don...", placeholder="Canapé, légumes, vêtements...")
        with col2:
            category_filter = st.selectbox("Catégorie", ["Toutes"] + [cat["display_name"] for cat in categories])
        with col3:
            sort_by = st.selectbox("Trier par", ["Plus récents", "Plus proches", "Plus populaires"])
        
        # Filtrer les dons
        filtered_donations = donations
        if search_query:
            filtered_donations = [d for d in filtered_donations if search_query.lower() in d['title'].lower() or search_query.lower() in d['description'].lower()]
        if category_filter != "Toutes":
            category_map = {cat["display_name"]: cat["name"] for cat in categories}
            filtered_donations = [d for d in filtered_donations if d['category'] == category_map[category_filter]]
        
        # Afficher la grille
        if not filtered_donations:
            st.info("🔍 Aucun don trouvé avec ces critères de recherche.")
        else:
            cols = st.columns(2)
            for idx, donation in enumerate(filtered_donations[:6]):  # Limiter à 6 dons
                with cols[idx % 2]:
                    self.display_donation_card(donation)
    
    def display_donation_card(self, donation):
        """Carte individuelle de don"""
        color = self.get_category_color(donation['category'])
        icon = self.get_category_icon(donation['category'])
        
        with st.container():
            st.markdown(f"""
            <div class="donation-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: #212529;">{donation['title']}</h3>
                    <span class="category-badge" style="background-color: {color};">
                        {icon} {donation['category'].capitalize()}
                    </span>
                </div>
                <p style="color: #6C757D; margin-bottom: 15px; line-height: 1.5;">{donation['description']}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
                    <div>
                        <div style="color: #495057;">📍 {donation['location']['address']}</div>
                        <div style="color: #6C757D;">Par {donation['donor']['username']} ⭐ {donation['donor']['rating']}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #6C757D;">❤️ {donation['likes_count']}</div>
                        <div style="color: #6C757D;">👁️ {donation['views']}</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            col1, col2 = st.columns(2)
            with col1:
                if st.button("👀 Voir", key=f"view_{donation['id']}", use_container_width=True):
                    st.session_state.selected_donation = donation
            with col2:
                if st.button("💌 Contacter", key=f"contact_{donation['id']}", use_container_width=True):
                    st.success(f"📧 Message envoyé à {donation['donor']['username']} pour '{donation['title']}'")
    
    def display_donation_detail(self, donation):
        """Détail d'un don sélectionné"""
        st.markdown("---")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader(donation['title'])
            
            # Badge catégorie
            color = self.get_category_color(donation['category'])
            icon = self.get_category_icon(donation['category'])
            st.markdown(f"""
            <span class="category-badge" style="background-color: {color}; font-size: 1rem;">
                {icon} {donation['category'].capitalize()}
            </span>
            """, unsafe_allow_html=True)
            
            st.markdown("---")
            st.subheader("Description")
            st.write(donation['description'])
            
            # Caractéristiques
            st.subheader("📋 Détails")
            col1_1, col1_2, col1_3 = st.columns(3)
            with col1_1:
                st.metric("État", donation['condition'].capitalize())
            with col1_2:
                st.metric("Localisation", donation['location']['address'])
            with col1_3:
                st.metric("Statut", "Disponible" if donation['status'] == 'disponible' else donation['status'])
        
        with col2:
            st.subheader("👤 Donneur")
            st.write(f"**{donation['donor']['username']}**")
            st.write(f"⭐ Note: {donation['donor']['rating']}/5")
            
            st.markdown("---")
            st.subheader("Actions")
            
            if st.button("📧 Envoyer un message", use_container_width=True, type="primary"):
                st.success("Message envoyé! Le donneur vous répondra sous 24h.")
            
            if st.button("❤️ Ajouter aux favoris", use_container_width=True):
                st.success("Ajouté à vos favoris!")
            
            if st.button("🔄 Voir d'autres dons", use_container_width=True):
                if 'selected_donation' in st.session_state:
                    del st.session_state.selected_donation
                st.rerun()
    
    def display_publish_form(self):
        """Formulaire de publication de don"""
        st.markdown("---")
        st.subheader("🎯 Publier un Nouveau Don")
        
        with st.form("new_donation_form"):
            col1, col2 = st.columns(2)
            
            with col1:
                title = st.text_input("📌 Titre du don*", placeholder="Ex: Canapé 3 places en bon état")
                category = st.selectbox("📂 Catégorie*", ["objets", "nourriture", "vetements", "electronique", "autre"])
                condition = st.selectbox("🔧 État*", ["neuf", "excellent", "bon", "usage", "a_reparer"])
            
            with col2:
                description = st.text_area("📝 Description*", 
                                         placeholder="Décrivez votre don, son état, les conditions de récupération...",
                                         height=120)
                address = st.text_input("📍 Localisation*", placeholder="Ville ou arrondissement")
            
            # Instructions de retrait
            pickup_info = st.text_area("🚚 Instructions de retrait", 
                                     placeholder="Disponibilités, étage, code porte...",
                                     height=80)
            
            # Bouton de soumission
            submitted = st.form_submit_button("🚀 Publier mon don", type="primary", use_container_width=True)
            
            if submitted:
                if title and description and address:
                    # Simulation de publication
                    st.success("✅ Votre don a été publié avec succès !")
                    st.balloons()
                    
                    # Réinitialiser le formulaire
                    st.rerun()
                else:
                    st.error("❌ Veuillez remplir tous les champs obligatoires (*)")
    
    def run(self):
        """Lancer l'application principale"""
        
        # Initialiser l'état de session
        if 'current_page' not in st.session_state:
            st.session_state.current_page = "home"
        if 'selected_donation' not in st.session_state:
            st.session_state.selected_donation = None
        
        # Charger les données
        data = self.get_mock_data()
        
        # Sidebar
        with st.sidebar:
            st.image("https://via.placeholder.com/150x50/2E8B57/FFFFFF?text=DonationApp", width=150)
            st.markdown("---")
            
            # Navigation
            st.subheader("Navigation")
            if st.button("🏠 Accueil", use_container_width=True):
                st.session_state.current_page = "home"
                if 'selected_donation' in st.session_state:
                    del st.session_state.selected_donation
            
            if st.button("🗺️ Carte des dons", use_container_width=True):
                st.session_state.current_page = "map"
            
            if st.button("🎁 Publier un don", use_container_width=True):
                st.session_state.current_page = "publish"
            
            st.markdown("---")
            
            # Filtres rapides
            st.subheader("Filtres Rapides")
            for category in data['categories']:
                if st.button(f"{category['icon']} {category['display_name']}", key=f"filter_{category['name']}", use_container_width=True):
                    st.session_state.current_page = "home"
                    # Ici vous pourriez appliquer le filtre
            
            st.markdown("---")
            
            # Statistiques sidebar
            st.subheader("📈 Stats Communauté")
            st.metric("Dons actifs", data['stats']['total_donations'])
            st.metric("Membres", data['stats']['active_users'])
            st.metric("Satisfaction", data['stats']['satisfaction_rate'])
        
        # Contenu principal
        if st.session_state.selected_donation:
            self.display_donation_detail(st.session_state.selected_donation)
        elif st.session_state.current_page == "home":
            self.display_hero_section()
            self.display_stats_section(data['stats'])
            self.display_donations_grid(data['donations'], data['categories'])
        elif st.session_state.current_page == "publish":
            self.display_hero_section()
            self.display_publish_form()
        elif st.session_state.current_page == "map":
            self.display_hero_section()
            st.subheader("🗺️ Carte Interactive")
            st.info("🚧 La fonctionnalité carte est en cours de développement. En attendant, consultez la liste des dons ci-dessus.")
            # Ici vous pourriez intégrer une carte plus tard

# Lancer l'application
if __name__ == "__main__":
    app = DonationApp()
    app.run()
