import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import {
  CreateScoreInningDto,
  CreateBallDto,
  ChangeBowlerDto,
  ChangeStrikerDto,
  GetStateDto,
} from './dto/create-score.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post('start-inning')
  startInning(@Body() createScoreInningDto: CreateScoreInningDto) {
    return this.scoreService.startInning(createScoreInningDto);
  }

  @Post('ball')
  postBall(@Body() createBallDto: CreateBallDto) {
    return this.scoreService.postBallEvent(createBallDto);
  }

  @Get('match/:matchId/state')
  async getMatchState(@Param('matchId') matchId: GetStateDto) {
    return this.scoreService.getMatchState(matchId);
  }

  @Post('change-striker')
  changeStriker(@Body() changeStrikerDto: ChangeStrikerDto) {
    return this.scoreService.changeStriker(changeStrikerDto);
  }

  @Post('change-bowler')
  changeBowler(@Body() changeBowlerDto: ChangeBowlerDto) {
    return this.scoreService.changeBowler(changeBowlerDto);
  }
}
