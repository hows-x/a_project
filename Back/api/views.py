# api/views.py
from django.contrib.auth import authenticate
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model



from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

User = get_user_model() # <- seguro cuando se usa correctamente

# Helper: crear refresh + access tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

class RegisterAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        username = data.get("email") or data.get("username")
        email = data.get("email")
        password = data.get("password")
        name = data.get("name") or ""

        if not email or not password:
            return Response({"error": "email y password son obligatorios"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email ya registrado"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password, first_name=name)
        user.save()

        serializer = UserSerializer(user)
        return Response({"user": serializer.data}, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return Response({"error": "email y password son obligatorios"}, status=status.HTTP_400_BAD_REQUEST)

        # Encontrar usuario por email: Django default usa username para authenticate, así que adaptamos
        try:
            user = User.objects.get(email=email)
            username = user.username
        except User.DoesNotExist:
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)
        access_token = tokens["access"]
        refresh_token = tokens["refresh"]

        # Response: devolver algo útil y SET-COOKIE (HttpOnly)
        resp = Response({"message": "Login OK", "user": UserSerializer(user).data}, status=status.HTTP_200_OK)

        # Ajusta cookie según seguridad de tu entorno
        # Set-Cookie para access token (ejemplo). En producción: secure=True, samesite='None' si frontend cross-site.
        resp.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,        # True en producción (HTTPS)
            samesite="Lax",
            max_age=15 * 60      # 15 minutos
        )
        # set cookie refresh (opcional)
        resp.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7 * 24 * 3600
        )

        return resp


class MeAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # Borra cookies en cliente
        resp = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
        resp.delete_cookie("access_token")
        resp.delete_cookie("refresh_token")
        return resp
