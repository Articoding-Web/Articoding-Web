import XAPI, { Statement } from "@xapi/xapi";
import config from "../Game/config";

class XAPISingleton {

  private static instance: XAPI | null = null;

  private constructor() {}

  public static getInstance(): XAPI {
    if (!XAPISingleton.instance) {
      const endpoint = config.LRS_ENDPOINT;
      const username = config.LRS_USERNAME;
      const password = config.LRS_PASSWORD;

      const auth = XAPI.toBasicAuth(username, password);
      XAPISingleton.instance = new XAPI({
        endpoint: endpoint,
        auth: auth
      });
    }
    return XAPISingleton.instance;
  }

  public static sendStatement(statement : Statement ){
    XAPISingleton.getInstance().sendStatement({
      statement
    });
  }

  public static levelCompletedStatement(
    userName: string, levelId: string, stars: number, speed: number, attempts: number, 
    playerBounced: boolean, totalLevels: number, userLevels: number, clickStopBtn: number) : Statement{
    const myStatement: Statement = {
      actor: {
        objectType: "Agent",
        account: {
          homePage: "https://articoding.e-ucm.es/",
          name: userName
        }
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/completed"
      },
      object: {
        id: `https://articoding.e-ucm.es/level?id=${levelId}`,
        definition: {
          type: "https://w3id.org/xapi/seriousgames/activity-types/level"
        }
      },
      result: {
        success: true,
        score: {
          scaled: 1,
          raw: stars,
          min: 0,
          max: 3
        },
        extensions: {
          "https://articoding.e-ucm.es/exts/minimum-blocks": true, //TODO
          "https://articoding.e-ucm.es/exts/blocks-used": 3, //TODO
          "https://articoding.e-ucm.es/exts/game-velocity": speed,
          "https://articoding.e-ucm.es/exts/attempts-until-win": attempts,
          "https://articoding.e-ucm.es/exts/bounced": playerBounced,
          "https://articoding.e-ucm.es/exts/total-official-levels": totalLevels,
          "https://articoding.e-ucm.es/exts/user-levels-completed": userLevels,
          "https://articoding.e-ucm.es/exts/clicks-stop-btn": clickStopBtn,
          "https://articoding.e-ucm.es/exts/code": '...' //TODO
        }
      },
      context: {
        extensions: {
          "https://articoding.e-ucm.es/exts/game-version": config.GAME_VERSION
        }
      }
    }
    return myStatement;
  }
  public static levelFailedStatement(
    userName: string, levelId: string, speed: number, attempt: number, playerBounced: boolean, 
    totalLevels: number, userLevels: number, clickStopBtn: number): Statement {
    const myStatement: Statement = {
      actor: {
        objectType: "Agent",
        account: {
          homePage: "https://articoding.e-ucm.es/",
          name: userName
        }
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/failed"
      },
      object: {
        id: `https://articoding.e-ucm.es/level?id=${levelId}`,
        definition: {
          type: "https://w3id.org/xapi/seriousgames/activity-types/level"
        }
      },
      result: {
        success: false,
        extensions: {
          "https://articoding.e-ucm.es/exts/blocks-used": 3, //TODO
          "https://articoding.e-ucm.es/exts/game-velocity": speed,
          "https://articoding.e-ucm.es/exts/index-attempt": attempt,
          "https://articoding.e-ucm.es/exts/bounced": playerBounced,
          "https://articoding.e-ucm.es/exts/total-official-levels": totalLevels,
          "https://articoding.e-ucm.es/exts/user-levels-completed": userLevels,
          "https://articoding.e-ucm.es/exts/clicks-stop-Btn": clickStopBtn,
          "https://articoding.e-ucm.es/exts/code": '...' //TODO
        }
      },
      "context": {
        "extensions": {
          "https://articoding.e-ucm.es/game-version": config.GAME_VERSION
        }
      }
    }
    return myStatement;
  }

  public static screenAccessedStament(userName: string, url: string){
    const myStatement: Statement = {
      actor: {
        objectType: "Agent",
        account: {
          homePage: "https://articoding.e-ucm.es/",
          name: userName
        }
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/accessed"
      },
      object: {
        id: `https://articoding.e-ucm.es/${url}`,
        definition: {
          type: "https://w3id.org/xapi/seriousgames/activity-types/screen"
        }
      },
      context: {
        extensions: {
          "https://articoding.e-ucm.es/game-version": config.GAME_VERSION
        }
      }
    }
    return myStatement;
  }

  

}

export default XAPISingleton;


