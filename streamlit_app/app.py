import streamlit as st
import requests
import json
import pandas as pd
from datetime import datetime
import folium
from streamlit_folium import st_folium
import math

# Configuration de la page
st.set_page_config(
    page_title="Donation App",
    page_icon="🎁",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personnalisé
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #2E8B57;
        text-align: center;
        margin-bottom: 2rem;
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

# Fonctions utilitaires
def get_category_color(category):
    colors = {
        'nourriture': '#FF7F50',
        'objets': '#2E8B57',
        'vetements': '#9370DB',
        'electronique': '#4169E1',
        'autre': '#6C757D'
    }
    return colors.get(category, '#6C757D')

def get_category_icon(category):
    icons = {
        'nourriture': '🍎',
        'objets': '📦',
        'vetements': '👕',
        'electronique': '💻',
        'autre': '🎁'
    }
    return icons.get(category, '🎁')

def calculate_distance(lat1, lon1, lat2, lon2):
    # Calcul simple de distance (approximatif)
    return math.sqrt((lat2 - lat1)**2 + (lon2 - lon1)**2) * 111

class DonationApp:
    def __init__(self):
        self.base_url = "https://votre-backend.lovable.app/api/v1"  # Remplacez par votre URL
        
    def load_donations(self):
        """Charger les dons depuis l'API"""
        try:
            # Pour le moment, on utilise des données mockées
            # Plus tard, vous pourrez utiliser votre API réelle
            mock_donations = [
                {
                    "id": 1,
                    "title": "Canapé 3 places",
                    "description": "Canapé en bon état, légères marques d'usure",
                    "category": "objets",
                    "status": "disponible",
                    "location": {
                        "coordinates": [2.2976, 48.8412],
                        "address": "15e arrondissement, Paris"
                    },
                    "donor": {"username": "Marie L."},
                    "condition": "bon",
                    "created_at": "2024-01-15T10:30:00Z",
                    "images": []
                },
                {
                    "id": 2,
                    "title": "Légumes du jardin",
                    "description": "Courgettes et tomates bio de mon jardin",
                    "category": "nourriture",
                    "status": "disponible",
                    "location": {
                        "coordinates": [2.3265, 48.8331],
                        "address": "14e arrondissement, Paris"
                    },
                    "donor": {"username": "Sophie M."},
                    "condition": "excellent",
                    "created_at": "2024-01-15T08:15:00Z",
                    "images": []
                },
                {
                    "id": 3,
                    "title": "Veste d'hiver",
                    "description": "Veste chaude taille M, presque neuve",
                    "category": "vetements",
                    "status": "disponible",
                    "location": {
                        "coordinates": [2.3555, 48.8289],
                        "address": "13e arrondissement, Paris"
                    },
                    "donor": {"username": "Thomas D."},
                    "condition": "excellent",
                    "created_at": "2024-01-14T16:45:00Z",
                    "images": []
                }
            ]
            return mock_donations
        except Exception as e:
            st.error(f"Erreur lors du chargement des dons: {e}")
            return []
    
    def create_map(self, donations, user_location=None):
        """Créer une carte Folium avec les dons"""
        # Centre sur Paris par défaut, ou sur la position utilisateur
        if user_location:
            center = [user_location['lat'], user_location['lon']]
            zoom_start = 13
        else:
            center = [48.8566, 2.3522]  # Paris
            zoom_start = 12
            
        m = folium.Map(location=center, zoom_start=zoom_start)
        
        # Ajouter marqueur position utilisateur
        if user_location:
            folium.Marker(
                [user_location['lat'], user_location['lon']],
                popup="📍 Votre position",
                icon=folium.Icon(color='blue', icon='user', prefix='fa')
            ).add_to(m)
        
        # Ajouter les marqueurs des dons
        for donation in donations:
            if donation.get('location') and donation['location'].get('coordinates'):
                coords = donation['location']['coordinates']
                lat, lon = coords[1], coords[0]  # Inverser les coordonnées
                
                # Popup HTML
                popup_html = f"""
                <div style="width: 250px;">
                    <h4>{donation['title']}</h4>
                    <p><strong>Catégorie:</strong> {donation['category']}</p>
                    <p>{donation['description'][:100]}...</p>
                    <p><strong>Donné par:</strong> {donation['donor']['username']}</p>
                    <button onclick="alert('Contactez {donation['donor']['username']}')" 
                            style="background: #2E8B57; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        Contacter
                    </button>
                </div>
                """
                
                folium.Marker(
                    [lat, lon],
                    popup=folium.Popup(popup_html, max_width=300),
                    tooltip=donation['title'],
                    icon=folium.Icon(
                        color='green' if donation['category'] == 'objets' else 
                              'orange' if donation['category'] == 'nourriture' else
                              'purple' if donation['category'] == 'vetements' else
                              'blue' if donation['category'] == 'electronique' else 'gray',
                        icon='gift'
                    )
                ).add_to(m)
        
        return m

    def run(self):
        """Lancer l'application Streamlit"""
        
        # Header
        st.markdown('<h1 class="main-header">🎁 Donation App</h1>', unsafe_allow_html=True)
        st.markdown("### Donnez une seconde vie à vos objets - Rejoignez la communauté solidaire")
        
        # Sidebar
        with st.sidebar:
            st.header("🔍 Filtres")
            
            # Filtre par catégorie
            categories = ["Toutes", "nourriture", "objets", "vetements", "electronique", "autre"]
            selected_category = st.selectbox("Catégorie", categories)
            
            # Filtre par distance
            use_location = st.checkbox("Près de moi")
            user_location = None
            
            if use_location:
                if st.button("📍 Obtenir ma position"):
                    # Simulation de géolocalisation
                    user_location = {"lat": 48.8566, "lon": 2.3522}  # Paris
                    st.success("Position détectée: Paris")
            
            # Statistiques
            st.header("📊 Statistiques")
            st.metric("Dons disponibles", "156")
            st.metric("Membres actifs", "1.2K")
            st.metric("CO2 économisé", "2.5T")
        
        # Charger les données
        donations = self.load_donations()
        
        # Filtrer les dons
        if selected_category != "Toutes":
            donations = [d for d in donations if d['category'] == selected_category]
        
        # Layout en colonnes
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.header("🗺️ Carte des Dons")
            
            # Créer et afficher la carte
            map_obj = self.create_map(donations, user_location)
            st_folium(map_obj, width=700, height=500)
            
            # Légende
            st.caption("🎯 Marqueurs verts: Objets | 🍊 Nourriture | 🟣 Vêtements | 🔵 Électronique")
        
        with col2:
            st.header("📋 Dons à Proximité")
            
            if not donations:
                st.info("Aucun don trouvé avec les filtres actuels")
            else:
                for donation in donations[:5]:  # Afficher les 5 premiers
                    with st.container():
                        color = get_category_color(donation['category'])
                        icon = get_category_icon(donation['category'])
                        
                        st.markdown(f"""
                        <div class="donation-card">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <h4 style="margin: 0;">{donation['title']}</h4>
                                <span class="category-badge" style="background-color: {color};">
                                    {icon} {donation['category']}
                                </span>
                            </div>
                            <p style="margin: 10px 0; color: #666;">{donation['description'][:80]}...</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #888;">
                                <span>📍 {donation['location']['address']}</span>
                                <span>par {donation['donor']['username']}</span>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Boutons d'action
                        col_btn1, col_btn2 = st.columns(2)
                        with col_btn1:
                            if st.button("👀 Voir", key=f"view_{donation['id']}", use_container_width=True):
                                st.session_state.selected_donation = donation
                        with col_btn2:
                            if st.button("💌 Contacter", key=f"contact_{donation['id']}", use_container_width=True):
                                st.success(f"Contactez {donation['donor']['username']} pour {donation['title']}")
        
        # Détail du don sélectionné
        if 'selected_donation' in st.session_state:
            donation = st.session_state.selected_donation
            st.markdown("---")
            st.header(f"🎁 {donation['title']}")
            
            col_detail1, col_detail2 = st.columns([2, 1])
            
            with col_detail1:
                st.subheader("Description")
                st.write(donation['description'])
                
                st.subheader("Détails")
                col_info1, col_info2, col_info3 = st.columns(3)
                
                with col_info1:
                    st.metric("Catégorie", donation['category'])
                with col_info2:
                    st.metric("Condition", donation['condition'])
                with col_info3:
                    st.metric("Localisation", donation['location']['address'])
            
            with col_detail2:
                st.subheader("Donneur")
                st.write(f"**{donation['donor']['username']}**")
                st.write("⭐ 4.8/5 (12 avis)")
                
                st.subheader("Actions")
                if st.button("📧 Envoyer un message", use_container_width=True):
                    st.success("Message envoyé! Le donneur vous répondra rapidement.")
                
                if st.button("❤️ Ajouter aux favoris", use_container_width=True):
                    st.success("Ajouté aux favoris!")
                
                if st.button("↩️ Retour à la liste", use_container_width=True):
                    del st.session_state.selected_donation
                    st.rerun()

        # Section Publier un don
        st.markdown("---")
        st.header("🎯 Publier un Don")
        
        with st.form("new_donation"):
            col_form1, col_form2 = st.columns(2)
            
            with col_form1:
                title = st.text_input("Titre du don*", placeholder="Ex: Canapé 3 places en bon état")
                category = st.selectbox("Catégorie*", ["objets", "nourriture", "vetements", "electronique", "autre"])
                condition = st.selectbox("État*", ["neuf", "excellent", "bon", "usage", "a_reparer"])
            
            with col_form2:
                description = st.text_area("Description*", placeholder="Décrivez votre don, son état, les conditions de récupération...", height=100)
                address = st.text_input("Localisation*", placeholder="Ville ou adresse approximative")
            
            # Bouton de soumission
            submitted = st.form_submit_button("🎁 Publier mon don", use_container_width=True)
            
            if submitted:
                if title and description and address:
                    st.success("✅ Don publié avec succès! Il sera visible dans quelques minutes.")
                    # Ici vous ajouterez l'appel à votre API
                else:
                    st.error("Veuillez remplir tous les champs obligatoires (*)")

# Lancer l'application
if __name__ == "__main__":
    app = DonationApp()
    app.run()
