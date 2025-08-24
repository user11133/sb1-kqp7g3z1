#!/usr/bin/env python3
import json
import uuid
from datetime import datetime, timedelta
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import random

# Sample data
USERS = [
    {
        "id": str(uuid.uuid4()),
        "firstName": "Ahmed",
        "lastName": "Ben Salah",
        "email": "ahmed.bensalah@email.com",
        "phone": "+216 20 123 456",
        "address": "Avenue Habib Bourguiba, Tunis",
        "governorate": "Tunis",
        "city": "Tunis",
        "status": "active",
        "registrationDate": "2024-01-15",
        "currentOffer": {
            "id": "1",
            "name": "Fibre Premium 100",
            "speed": "100 Mbps",
            "price": 45
        }
    },
    {
        "id": str(uuid.uuid4()),
        "firstName": "Fatima",
        "lastName": "Trabelsi",
        "email": "fatima.trabelsi@email.com",
        "phone": "+216 25 987 654",
        "address": "Rue de la République, Sfax",
        "governorate": "Sfax",
        "city": "Sfax",
        "status": "active",
        "registrationDate": "2024-02-20",
        "currentOffer": {
            "id": "2",
            "name": "Fibre Standard 50",
            "speed": "50 Mbps",
            "price": 35
        }
    },
    {
        "id": str(uuid.uuid4()),
        "firstName": "Mohamed",
        "lastName": "Khelifi",
        "email": "mohamed.khelifi@email.com",
        "phone": "+216 22 456 789",
        "address": "Boulevard 14 Janvier, Sousse",
        "governorate": "Sousse",
        "city": "Sousse",
        "status": "inactive",
        "registrationDate": "2024-03-10"
    },
    {
        "id": str(uuid.uuid4()),
        "firstName": "Leila",
        "lastName": "Mansouri",
        "email": "leila.mansouri@email.com",
        "phone": "+216 24 321 987",
        "address": "Avenue de la Liberté, Monastir",
        "governorate": "Monastir",
        "city": "Monastir",
        "status": "active",
        "registrationDate": "2024-01-30",
        "currentOffer": {
            "id": "3",
            "name": "Fibre Ultra 200",
            "speed": "200 Mbps",
            "price": 65
        }
    },
    {
        "id": str(uuid.uuid4()),
        "firstName": "Karim",
        "lastName": "Bouazizi",
        "email": "karim.bouazizi@email.com",
        "phone": "+216 26 654 321",
        "address": "Rue Farhat Hached, Bizerte",
        "governorate": "Bizerte",
        "city": "Bizerte",
        "status": "suspended",
        "registrationDate": "2024-02-05"
    }
]

OFFERS = [
    {
        "id": "1",
        "name": "Fibre Premium 100",
        "speed": "100 Mbps",
        "price": 45,
        "type": "fiber",
        "description": "Idéal pour les familles avec usage intensif d'internet",
        "features": [
            "Internet illimité",
            "WiFi haute performance inclus",
            "Installation gratuite",
            "Support technique 24/7",
            "Décodeur TV inclus"
        ],
        "isActive": True
    },
    {
        "id": "2",
        "name": "Fibre Standard 50",
        "speed": "50 Mbps",
        "price": 35,
        "type": "fiber",
        "description": "Parfait pour un usage quotidien et le streaming",
        "features": [
            "Internet illimité",
            "WiFi inclus",
            "Installation gratuite",
            "Support technique",
            "Anti-virus inclus"
        ],
        "isActive": True
    },
    {
        "id": "3",
        "name": "Fibre Ultra 200",
        "speed": "200 Mbps",
        "price": 65,
        "type": "fiber",
        "description": "La solution ultime pour les professionnels et gamers",
        "features": [
            "Internet illimité",
            "WiFi 6 premium inclus",
            "Installation et configuration incluses",
            "Support technique prioritaire 24/7",
            "Décodeur 4K inclus",
            "Gaming Pack inclus"
        ],
        "isActive": True
    },
    {
        "id": "4",
        "name": "Fibre Essential 25",
        "speed": "25 Mbps",
        "price": 25,
        "type": "fiber",
        "description": "Une connexion fiable pour un usage basique",
        "features": [
            "Internet illimité",
            "WiFi basique inclus",
            "Installation incluse",
            "Support technique"
        ],
        "isActive": True
    }
]

class TunisieTelecomHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/users':
            self._handle_get_users()
        elif path.startswith('/api/users/'):
            user_id = path.split('/')[-1]
            self._handle_get_user(user_id)
        elif path == '/api/offers':
            self._handle_get_offers()
        elif path == '/api/dashboard/stats':
            self._handle_get_dashboard_stats()
        else:
            self._send_404()

    def do_POST(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except:
            self._send_error(400, "Invalid JSON")
            return
            
        if path == '/api/users':
            self._handle_create_user(data)
        elif path == '/api/offers':
            self._handle_create_offer(data)
        else:
            self._send_404()

    def do_PUT(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        content_length = int(self.headers['Content-Length'])
        put_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(put_data.decode('utf-8'))
        except:
            self._send_error(400, "Invalid JSON")
            return
            
        if path.startswith('/api/users/'):
            user_id = path.split('/')[-1]
            self._handle_update_user(user_id, data)
        elif path.startswith('/api/offers/'):
            offer_id = path.split('/')[-1]
            self._handle_update_offer(offer_id, data)
        else:
            self._send_404()

    def do_DELETE(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path.startswith('/api/users/'):
            user_id = path.split('/')[-1]
            self._handle_delete_user(user_id)
        elif path.startswith('/api/offers/'):
            offer_id = path.split('/')[-1]
            self._handle_delete_offer(offer_id)
        else:
            self._send_404()

    def _handle_get_users(self):
        self._send_json_response(USERS)

    def _handle_get_user(self, user_id):
        user = next((u for u in USERS if u['id'] == user_id), None)
        if user:
            self._send_json_response(user)
        else:
            self._send_404()

    def _handle_create_user(self, data):
        new_user = {
            "id": str(uuid.uuid4()),
            "firstName": data.get('firstName', ''),
            "lastName": data.get('lastName', ''),
            "email": data.get('email', ''),
            "phone": data.get('phone', ''),
            "address": data.get('address', ''),
            "governorate": data.get('governorate', ''),
            "city": data.get('city', ''),
            "status": "active",
            "registrationDate": datetime.now().strftime('%Y-%m-%d')
        }
        USERS.append(new_user)
        self._send_json_response(new_user, 201)

    def _handle_update_user(self, user_id, data):
        user = next((u for u in USERS if u['id'] == user_id), None)
        if user:
            user.update(data)
            self._send_json_response(user)
        else:
            self._send_404()

    def _handle_delete_user(self, user_id):
        global USERS
        USERS = [u for u in USERS if u['id'] != user_id]
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def _handle_get_offers(self):
        self._send_json_response(OFFERS)

    def _handle_create_offer(self, data):
        new_offer = {
            "id": str(uuid.uuid4()),
            "name": data.get('name', ''),
            "speed": data.get('speed', ''),
            "price": data.get('price', 0),
            "type": data.get('type', 'fiber'),
            "description": data.get('description', ''),
            "features": data.get('features', []),
            "isActive": data.get('isActive', True)
        }
        OFFERS.append(new_offer)
        self._send_json_response(new_offer, 201)

    def _handle_update_offer(self, offer_id, data):
        offer = next((o for o in OFFERS if o['id'] == offer_id), None)
        if offer:
            offer.update(data)
            self._send_json_response(offer)
        else:
            self._send_404()

    def _handle_delete_offer(self, offer_id):
        global OFFERS
        OFFERS = [o for o in OFFERS if o['id'] != offer_id]
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def _handle_get_dashboard_stats(self):
        active_users = len([u for u in USERS if u['status'] == 'active'])
        total_revenue = sum(offer['price'] for offer in OFFERS if offer['isActive']) * active_users
        
        stats = {
            "totalUsers": len(USERS),
            "activeUsers": active_users,
            "totalOffers": len([o for o in OFFERS if o['isActive']]),
            "revenue": total_revenue,
            "newSubscriptionsToday": random.randint(5, 15),
            "averageSpeed": "75 Mbps"
        }
        self._send_json_response(stats)

    def _send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def _send_404(self):
        self.send_response(404)
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(b'Not Found')

    def _send_error(self, status_code, message):
        self.send_response(status_code)
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(message.encode('utf-8'))

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), TunisieTelecomHandler)
    print("🚀 Tunisie Telecom API Server running on http://localhost:8000")
    print("📊 Dashboard API endpoints available:")
    print("   - GET /api/users - Get all users")
    print("   - GET /api/offers - Get all offers")
    print("   - GET /api/dashboard/stats - Get dashboard statistics")
    print("🔥 Ready to manage optic fiber services!")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n⏹️  Server stopped")
        server.server_close()