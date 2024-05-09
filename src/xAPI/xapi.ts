import { Agent, Context, Statement } from "@xapi/xapi";
import config from "../Game/config";
import { fetchRequest } from "../SPA/utils";
const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;

class XAPISingleton {

  private static instance: XAPISingleton | null = null;
  private constructor() {}

  public static getInstance(): XAPISingleton {
    if (!XAPISingleton.instance) {
        XAPISingleton.instance = new XAPISingleton();
    }
    return XAPISingleton.instance;
  }

  private static createActor(userName: string): Agent {
    return {
      objectType: "Agent",
      account: {
        homePage: "https://articoding.e-ucm.es/",
        name: userName
      }
    };
  }

  private static createContext(uuid: string): Context {
    return {
      extensions: {
        "https://articoding.e-ucm.es/game-version": config.GAME_VERSION,
        "https://articoding.e-ucm.es/session":uuid 
      }
    };
  }
  public static async sendStatement(statement : Statement ){
    await fetchRequest(
      `${API_ENDPOINT}/statistics/`,
      "POST",
      JSON.stringify(statement)
    );
  }

  public static levelCompletedStatement(
    uuid: string, userName: string, levelId: string, stars: number, speed: number, attempts: number, 
    playerBounced: boolean, totalLevels: number, userLevels: number, clickStopBtn: number, nBlocks: number, code: string) : Statement{
    const actor = XAPISingleton.createActor(userName);
    const context: Context = XAPISingleton.createContext(uuid);
    const myStatement: Statement = {
      actor ,
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
          "https://articoding.e-ucm.es/exts/blocks-used": nBlocks, 
          "https://articoding.e-ucm.es/exts/game-velocity": speed,
          "https://articoding.e-ucm.es/exts/attempts-until-win": attempts,
          "https://articoding.e-ucm.es/exts/bounced": playerBounced,
          "https://articoding.e-ucm.es/exts/total-official-levels": totalLevels,
          "https://articoding.e-ucm.es/exts/user-levels-completed": userLevels,
          "https://articoding.e-ucm.es/exts/clicks-stop-btn": clickStopBtn,
          "https://articoding.e-ucm.es/exts/code": code
        }
      },
      context
    }
    return myStatement;
  }
  public static levelFailedStatement(
    uuid: string, userName: string, levelId: string, speed: number, attempt: number, playerBounced: boolean, 
    totalLevels: number, userLevels: number, clickStopBtn: number, nBlocks: number, code: string): Statement {
    const actor = XAPISingleton.createActor(userName);
    const context: Context = XAPISingleton.createContext(uuid);
    const myStatement: Statement = {
      actor,
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
          "https://articoding.e-ucm.es/exts/blocks-used": nBlocks,
          "https://articoding.e-ucm.es/exts/game-velocity": speed,
          "https://articoding.e-ucm.es/exts/index-attempt": attempt,
          "https://articoding.e-ucm.es/exts/bounced": playerBounced,
          "https://articoding.e-ucm.es/exts/total-official-levels": totalLevels,
          "https://articoding.e-ucm.es/exts/user-levels-completed": userLevels,
          "https://articoding.e-ucm.es/exts/clicks-stop-Btn": clickStopBtn,
          "https://articoding.e-ucm.es/exts/code": code
        }
      },
      context
    }
    return myStatement;
  }

  public static screenAccessedStatement(uuid: string, userName: string, url: string){
    const actor = XAPISingleton.createActor(userName);
    const context: Context = XAPISingleton.createContext(uuid);
    const myStatement: Statement = {
      actor,
      verb: {
        id: "http://adlnet.gov/expapi/verbs/accessed"
      },
      object: {
        id: `https://articoding.e-ucm.es/${url}`,
        definition: {
          type: "https://w3id.org/xapi/seriousgames/activity-types/screen"
        }
      },
      context
    }
    return myStatement;
  }

  public static iconInteractedStatement(uuid: string, userName: string, url: string){
    const actor = XAPISingleton.createActor(userName);
    const context: Context = XAPISingleton.createContext(uuid);
    const myStatement: Statement = {
      actor,
      verb: {
        id: "http://adlnet.gov/expapi/verbs/interacted"
      },
      object: {
        id: `https://articoding.e-ucm.es${url}`,
        definition: {
          type: "https://w3id.org/xapi/seriousgames/activity-types/screen"
        }
      },
      context
    }
    return myStatement;
  }

  public static changeStatusBlockStatement(uuid: string, levelId : string, userName: string, blockType : string, 
    name : string, oldValue: string, newValue: string){
    const actor = XAPISingleton.createActor(userName);
    const context: Context = XAPISingleton.createContext(uuid);
    const myStatement: Statement = {
      actor,
      verb: {
        id: "http://adlnet.gov/expapi/verbs/interacted"
      },
      object: {
        id: "https://articoding.e-ucm.es/activity/change-state-block",
        definition: {
          type: `https://articoding.e-ucm.es/activity-type/${blockType}`,
          extensions: {
            "https://articoding.e-ucm.es/exts/level-id": levelId,
            "https://articoding.e-ucm.es/exts/name": name,
            "https://articoding.e-ucm.es/exts/old-value": oldValue,
            "https://articoding.e-ucm.es/exts/new-value”": newValue,
          }
        }
      },
      context
    }
    return myStatement;
  }

  public static deleteBlockStatement(uuid: string, levelId : string, userName: string, blockType : string, deletedBlocks : string){
    const actor = XAPISingleton.createActor(userName);
    const context: Context = XAPISingleton.createContext(uuid);
    const myStatement: Statement = {
      actor,
      verb: {
        id: "http://adlnet.gov/expapi/verbs/interacted"
      },
      object: {
        id: "https://articoding.e-ucm.es/activity/delete-block",
        definition: {
          type: `https://articoding.e-ucm.es/activity-type/${blockType}`,
          extensions: {
            "https://articoding.e-ucm.es/exts/level-id": levelId,
            "https://articoding.e-ucm.es/exts/deleted-blocks": deletedBlocks,
          }
        }
      },
      context
    }
    return myStatement;
  }

  public static moveBlockStatement(uuid: string, levelId : string, userName: string, blockType : string, moveActions : string){
    const actor = XAPISingleton.createActor(userName);
    const context: Context = XAPISingleton.createContext(uuid);
    const myStatement: Statement = {
      actor,
      verb: {
        id: "http://adlnet.gov/expapi/verbs/interacted"
      },
      object: {
        id: "https://articoding.e-ucm.es/activity/move-block",
        definition: {
          type: `https://articoding.e-ucm.es/activity-type/${blockType}`,
          extensions: {
            "https://articoding.e-ucm.es/exts/level-id": levelId,
            "https://articoding.e-ucm.es/exts/move-actions": moveActions,
          }
        }
      },
      context
    }
    return myStatement;
  }

  public static loginStatement(uuid: string, userName: string): Statement{
    const actor = XAPISingleton.createActor(userName);
    const context: Context = XAPISingleton.createContext(uuid);
    const myStatement: Statement = {
      actor,
      verb: {
        id: "https://w3id.org/xapi/adl/verbs/logged-in"
      },
      object: {
        id: "https://articoding.e-ucm.es/",
      },
      context
    }
    return myStatement;
  }

  public static logoutStatement(uuid: string, userName: string): Statement{
    const actor = XAPISingleton.createActor(userName);
    const context: Context = XAPISingleton.createContext(uuid);
    const myStatement: Statement = {
      actor,
      verb: {
        id: "https://w3id.org/xapi/adl/verbs/logged-out"
      },
      object: {
        id: "https://articoding.e-ucm.es/profile",
      },
      context
    }
    return myStatement;
  }
}

export default XAPISingleton;


