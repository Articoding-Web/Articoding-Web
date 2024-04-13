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

  public static levelCompletedStatement(userName: string, levelId: string, stars: number) : Statement{
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
  public static levelFailedStatement(userName: string, levelId: string): Statement {
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


