from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    confirm_password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = ["email", "password", "confirm_password"]

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Password do not match")
        
        return data
    
    def create(self, validated_data):
        validated_data.pop("confirm_password")

        return User.objects.create_user(
            validated_data["email"],
            validated_data["password"]
        )