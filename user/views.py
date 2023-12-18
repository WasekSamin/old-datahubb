from django.http import JsonResponse
from django.shortcuts import render
from .models import UserAccount
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserAccountSerializer, UserAccountTokenSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response as response
from rest_framework_simplejwt.views import TokenObtainPairView


class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserAccountSerializer(data=request.data)
        try:
            if serializer.is_valid():
                user = serializer.save()
                token = RefreshToken.for_user(user)
                response_data = {
                    "refresh": str(token),
                    "access_token": str(token.access_token),
                    "user": serializer.data,
                }
                return response(response_data, status=status.HTTP_201_CREATED)
            else:
                return response(status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return response({"Error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserAccountTokenSerializer
    

class UserDetailsView(APIView):
    def post(self, request):
        try:
            user = UserAccount.objects.get(
                id=request.user.id
            )
            serializer_class = UserAccountSerializer(user)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PutUserProfile(APIView):
    message = "Email already registered please use another email"

    def put(self, request):
        try:
            user = UserAccount.objects.get(
                id=request.user.id
            )
            get_email = request.data.get("email")
            if get_email:
                user.email = get_email
            else:
                user.email = user.email
            existing_email = UserAccount.objects.filter(
                email=get_email
            )
            # if existing_email and :
            #     return JsonResponse({
            #         "success": False,
            #         "message": "Email already registered to another user! please use another user"
            #     }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            user.first_name = request.data.get("first_name")
            user.last_name = request.data.get("last_name")
            user.company_name = request.data.get("company_name")
            user.phone_number = request.data.get("phone_number")
            password = request.data.get("password")
            if password:
                user.set_password(password)
            else:
                user.password = user.password
            user.save()
            serializer_class = UserAccountSerializer(user)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except UserAccount.DoesNotExist:
            return response({
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
