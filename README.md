# RealTimeCommunication
This repo shows real-time communication using Django, WebSocket, SQLite, and a React + Vite frontend. It’s a simple demo of WebSockets in Django.

## Roadmap
- Screenshot
- Prerequisites
- Getting Started
- Author

## Screenshot
![Screenshot](Screenshot.png)

## Prerequisites

### Backend
- Python 3
- Django
- Daphne (ASGI server)
- Channels (for WebSocket support)

### Frontend
- Node.js & npm or yarn
- React
- Vite

## Getting Started

### Backend
```bash
python3 manage.py migrate
```

```bash
daphne -p 8000 api.asgi:application
```

### Frontend 
```bash
cd frontend
```

```bash
yarn install

```
```bash
yarn dev
```

## Author
- [Agni Ramadani](https://github.com/agniramadani)
