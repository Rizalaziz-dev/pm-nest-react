import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
        // Look for the token in the 'Authorization: Bearer <token>' header
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        // || 'fallback_secret', its called Nullish Coalescing
        // to tell the typescript "Hey, try to get the secret from the config. But if that's undefined, use this string 'fallback_secret' instead."
        // secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret'
        
        // Or 
        secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
        // Best: Throw an error if it's missing so you know immediately
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) throw new Error("JWT_SECRET is missing from .env!");
    }

    // If the token is valid, this function runs
    async validate(payload: any){
        // Will return 'req.user' in controller
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role
        }
    }
}