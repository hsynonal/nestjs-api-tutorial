import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';
import { link } from 'fs';

describe('App2e2', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async() => {
    const moduleRef = 
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma= app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');// her bölüme local hostu yazmamıza gerek kalmadı sadece 
                                                       // hangi bölümü belirtmemiz gerekiyor. Daha kısa ve daha temiz. 
  }); 
  afterAll(() => {
    app.close();
  });
  
  describe('Auth', ()=>{
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '123',
    }
    //kayıt işlemi (kullanıcı kayıt olur)
    describe('Signup', ()=>{
      it("should throw if email empty", () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });
      it("should throw if password empty", () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });
      it("should throw if no body provided", () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it("should signup", () => {
        
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
      })
    });
    //Kullanıcı oturum açar
    describe('Signin', ()=>{
      it("should throw if email empty", () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });
      it("should throw if password empty", () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });
      it("should throw if no body provided", () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it("should signin", () => {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'acces_token')
      });//Böylece erişim belirtecini gövdeden erişim belirtecinden değişkeninden alacak
    });
  });
  //Mevcut kullanıcı bilgilerini almak için bir GET isteği oluşturur ve yanıtın başarılı olup olmadığını kontrol eder
  describe('User', ()=>{
    describe('Get me', ()=>{
      it('user get current user', () => {
        return pactum.spec().get('/users/me').withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(200)  //.inspetc() eklenebilir (yöntemi, bir isteğin yanıtını yakalayarak daha fazla işlem yapmanızı sağlar.)
      });
    });
    //Kullanıcının bilgilerini düzenlemek için /users endpointine bir PATCH isteği gönderilir.
    describe('Edit user', ()=>{
      it('should edit user', () => {
        const dto: EditUserDto= {
          firstName: 'Hüseyin',
          email: 'hsyn.351942@gmail.com',
        };
        return pactum.spec().patch('/users').withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(dto).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email)  //.inspetc() eklenebilir (yöntemi, bir isteğin yanıtını yakalayarak daha fazla işlem yapmanızı sağlar.)
      });
    });

    
  });

  describe('Bookmarks', ()=>{  
    describe('Get empty bookmarks', ()=>{//ilk boş yer işaretlerini alıyoruz
      it('should get bookmarks', () => {
        return pactum.spec().get('/bookmarks').withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(200).expectBody([])
      })
    }); 

    describe('Create bookmarks', ()=>{
      const dto: CreateBookmarkDto= {
        title:'first bookmark',
        link:'https://www.youtube.com/watch?v=TqtqiYXm2Ww&t=1s&ab_channel=H%C3%BCseyin%C3%96nal',
      };
      it('should create bookmark', () => {
        return pactum.spec().post('/bookmarks:').withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(dto).expectStatus(201).inspect();
      })
    });

    describe('Get bookmarks', ()=>{});

    describe('Get bookmarks by id ', ()=>{});

    describe('Edit bookmarks by id', ()=>{});

    describe('Delete bookmarks by id', ()=>{});
  });
  
  
});