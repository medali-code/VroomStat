import { Test, TestingModule } from '@nestjs/testing';
import { SinistreController } from './sinistre.controller';
import { SinistreService } from './sinistre.service';

describe('SinistreController', () => {
  let controller: SinistreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SinistreController],
      providers: [SinistreService],
    }).compile();

    controller = module.get<SinistreController>(SinistreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
