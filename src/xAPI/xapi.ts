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
    playerBounced: boolean, totalLevels: number, userLevels: number) : Statement{
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
          "https://articoding.e-ucm.es/exts/minimumBlocks": true, //TODO
          "https://articoding.e-ucm.es/exts/blocksUsed": 3, //TODO
          "https://articoding.e-ucm.es/exts/gameVelocity": speed,
          "https://articoding.e-ucm.es/exts/attemptsUntilWin": attempts,
          "https://articoding.e-ucm.es/exts/bounced": playerBounced,
          "https://articoding.e-ucm.es/exts/totalOfficialLevels": totalLevels,
          "https://articoding.e-ucm.es/exts/userLevelsCompleted": userLevels,
          "https://articoding.e-ucm.es/exts/code": '...' //TODO
        }
      },
      context: {
        extensions: {
          "https://articoding.e-ucm.es/exts/gameVersion": config.GAME_VERSION
        }
      }
    }
    return myStatement;
  }
  public static levelFailedStatement(
    userName: string, levelId: string, speed: number, attempt: number, playerBounced: boolean, 
    totalLevels: number, userLevels: number): Statement {
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
          "https://articoding.e-ucm.es/exts/blocksUsed": 3, //TODO
          "https://articoding.e-ucm.es/exts/gameVelocity": speed,
          "https://articoding.e-ucm.es/exts/nAttempt": attempt,
          "https://articoding.e-ucm.es/exts/bounced": playerBounced,
          "https://articoding.e-ucm.es/exts/totalOfficialLevels": totalLevels,
          "https://articoding.e-ucm.es/exts/userLevelsCompleted": userLevels,
          "https://articoding.e-ucm.es/exts/code": '...' //TODO
        }
      },
      "context": {
        "extensions": {
          "https://articoding.e-ucm.es/gameVersion": config.GAME_VERSION
        }
      }
    }
    return myStatement;
  }
}

export default XAPISingleton;


