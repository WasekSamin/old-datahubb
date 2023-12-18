from rest_framework import serializers
from .models import UserAccount
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "password",
            "phone_number",
            "company_name"
        ]

    def create(self, validated_data):
        try:
            first_name = validated_data.get("first_name")
            last_name = validated_data.get("last_name")
            email = validated_data.get("email")
            password = validated_data.get("password")

            existing_user = UserAccount.objects.filter(
                email=email
            )
            if not existing_user:
                user = UserAccount(
                    first_name=first_name,
                    last_name=last_name,
                    email=email
                )
                user.set_password(password)
                user.save()
                return user
            else:
                raise serializers.ValidationError({
                    "message": "User Already Exists"
                })
        except Exception as e:
            return str(e)

    
class UserAccountTokenSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        "no_active_account": "Email or Password doesn't match our records",
        "incorrect_password": "Wrong passwordp provided",
        "email_not_found": "Email doesn't match our records"
    }

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if user is None:
            raise serializers.ValidationError(self.error_messages["Email not found!"])
        if not user.check_password(attrs["password"]):
            raise serializers.ValidationError(self.error_messages['incorrect_password'])
        data["user"] = UserAccountSerializer(self.user).data
        return data