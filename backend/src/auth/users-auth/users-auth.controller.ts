import { Controller, Post, Body, Res, Req, Get, UnauthorizedException, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersAuthService } from './users-auth.service';
import { User } from 'src/users/models/user.schema';

interface VerifyOtpDto{
    email:string;
    otp:string;
}

@Controller('auth/user')
export class UsersAuthController {
    constructor(private usersAuthService: UsersAuthService){};

    @Post('login')
    async login(
        @Body() loginData: Partial<User>,
        @Res({passthrough: true}) response: Response
    ){
        if(loginData.username && loginData.password){
            return await this.usersAuthService.login(
                loginData.username,
                loginData.password,
                response
            );
        }
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() userData: User,
    ){
        return await this.usersAuthService.register(userData);
    }

    @Post('resend-otp')
    async resendOtp(@Body() body:{email:string}){
        return await this.usersAuthService.resendOtp(body.email);
    }

    @Post('verify-email')
    async verifyOtp(
        @Body() verifyOtpDto: VerifyOtpDto,
    ){
        try {
            const { email, otp} = verifyOtpDto;
            if(!email || !otp){
                return {
                    success: false,
                    error: {
                      message: 'Email and OTP are required',
                      fieldsMissing: true
                    }
                };
            }
            console.log(email, otp);
            const result = await this.usersAuthService.verifyOtp(email,otp);
            return result;
        } catch (error) {
            return {
                success: false,
                error: {
                  message: 'Verification failed',
                  verificationFailed: true
                }
            };
        }
    }

    @Post('forgot-password')
    async sendPasswordResetOtp(@Body() body:{email:string}){
        return await this.usersAuthService.resendOtp(body.email);
    }

    @Post('verify-reset-otp')
    async verifyPasswordResetOtp(@Body() body:{email:string, otp:string}){
        return await this.usersAuthService.verifyOtp(body.email,body.otp);
    }

    @Post('reset-password')
    async resetPassword(@Body() body:{email:string, newPassword:string}){
        const result = await this.usersAuthService.resetPassword(body.email,body.newPassword);
        return result;
    }
}
