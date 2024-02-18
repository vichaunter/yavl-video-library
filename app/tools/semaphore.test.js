import 'regenerator-runtime';
import Semaphore from './semaphore';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

test('return a function', async () => {
  const semaphore = new Semaphore(1);
  const release = await semaphore.acquire();
  expect(release).toEqual(expect.any(Function));
});

test('throw of release twice the same', async () => {
  const semaphore = new Semaphore(1);
  const release = await semaphore.acquire();
  release();
  expect.assertions(1);
  try {
    release();
  } catch (e) {
    expect(e).toEqual(new Error('Try to release the semaphore more than once'));
  }
});

test('lock the semaphore', async () => {
  const semaphore = new Semaphore(1);
  await semaphore.acquire();
  let acquired = false;

  setTimeout(async () => {
    await semaphore.acquire();
    acquired = true;
  }, 50);

  await sleep(100);
  expect(acquired).toBe(false);
});

test('release the semaphore', async () => {
  const semaphore = new Semaphore(1);
  const release = await semaphore.acquire();
  let acquired = false;

  setTimeout(async () => {
    await semaphore.acquire();
    acquired = true;
  }, 50);

  release();
  await sleep(100);
  expect(acquired).toBe(true);
});


test('handle multiple lock', async () => {
  // t0
  const semaphore = new Semaphore(2);
  const release1 = await semaphore.acquire();
  await semaphore.acquire();
  let release3 = null;

  let acquired1 = false;
  let acquired2 = false;

  setTimeout(async () => {
    // t0 + 25
    release3 = await semaphore.acquire();
    acquired1 = true;
    await sleep(25);
    // t0 + release1() + 25
    release3();
    release3 = null;
  }, 25);

  setTimeout(async () => {
    // t0 + 75
    await semaphore.acquire();
    acquired2 = true;
  }, 75);


  // Initial state
  expect(acquired1).toBe(false);
  expect(acquired2).toBe(false);
  expect(release3).toBe(null);

  await sleep(30);
  // t0 + 30

  release1();

  await sleep(20);
  // t0 + 50

  expect(acquired1).toBe(true);
  expect(acquired2).toBe(false);
  expect(release3).toEqual(expect.any(Function));

  await sleep(50);
  // t0 + 100

  expect(acquired1).toBe(true);
  expect(acquired2).toBe(true);
  expect(release3).toBe(null);
});
