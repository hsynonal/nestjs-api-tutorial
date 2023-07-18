import { Controller, Post, HttpCode, HttpStatus, Query} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";


@Controller ('auth')
export class AuthController {
    constructor(private authService: AuthService) {}//modül
    
    

    
    @Post('signup')
   async signup(
        @Query() dto: AuthDto,
        //@Body() dto: AuthDto
        ){
        
         
        //console.log({
        //    dto,  singnup(dto) parantezin içindeki dto ekleyince burayı sildik 
        //})  
        console.log('kayıt');
        
        return await this.authService.signup(dto);//this gösterme işlemi yapar
    }
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(
        @Query() dto: AuthDto,
        //@Body() dto: AuthDto, 
        ){
        console.log('giriş');
        return await this.authService.signin(dto)    
        
    }




    
}