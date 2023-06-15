import { expect } from 'chai';
import * as sinon from 'sinon';
import { z } from 'zod';
import { magicJS } from '../lib/magicJS';
import fetch from 'node-fetch';
import { useMagicJS } from '../lib/useMagicJS';

describe('magicjs', () => {
  const setReactState = sinon.stub();

  before(() => {
    magicJS.initialize({
      fetch,
      openAIApiKey: '',
      model: 'gpt-3.5-turbo-0613',
      React: {
        useEffect: (func: () => void, deps: Array<any>) => {
          func();
        },
        useState: (val) => {
          return [val, setReactState];
        },
        useMemo: (func: () => void, deps: Array<any>) => {
          return func();
        },
      },
    });
  });

  it('sorts a list', async () => {
    expect(await magicJS('sort this list', z.array(z.number()), [10, 9, 2])).to.eql([2, 9, 10]);
  });

  it('makes decisions', async () => {
    expect(
      await magicJS('clap hands if this library can work', z.enum(['clap', 'no_clap']), [
        {
          username: 'user1',
          works: 11,
        },
        {
          username: 'user2',
          works: 10,
        },
        {
          username: 'user3',
          works: 1,
        },
      ]),
    ).to.eql('clap');
  });

  it('writes code', async () => {
    expect(
      await magicJS('write a SQL query to select all users from the USERS table', z.string()),
    ).to.eql('SELECT * FROM USERS');
  });

  it('writes code in React', async () => {
    const [, loading] = useMagicJS('write a SQL query to select all users from the USERS table', z.string());

    expect(loading).to.eql(true);

    // I apologise in advance to all my fellow
    // developers who have to see this
    const expected = 'SELECT * FROM USERS';

    const final = await new Promise((resolve) => {
      const interval = setInterval(() => {
        const calls = setReactState.getCalls();
        calls.forEach((call) => {
          if (call.args[0] === expected) {
            resolve(expected);
            clearInterval(interval);
          }
        });
      }, 100);
    });

    expect(final).to.eql(expected);
  });
}).timeout(10000);
