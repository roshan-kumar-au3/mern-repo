const puppeteer = require('puppeteer');
const { uuid } = require('uuidv4');
var emailFinder = require('../lib/email-finder');
const Search = require('../model/searchResult');
let newPage;

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function getProfiles(page, data) {
    console.log(data, 'getProfilesFn')
    await page.click('.pagination__quick-link.pagination__quick-link--next');
    await page.waitForNavigation();
    await autoScroll(page);
    const nextPageHandles = await page.$$('.simple-form > ol > li');

    for (let [i, profile] of nextPageHandles.entries()) {
        const name = await page.evaluate(el => el.querySelector('a').textContent, profile);
        const location = await page.evaluate(el => el.querySelector('.artdeco-entity-lockup__metadata > div').textContent, profile);
        const profileLink = await page.evaluate(el => el.querySelector('a').href, profile);
        const jobTitle = await page.evaluate(el => el.querySelector('.artdeco-entity-lockup__subtitle').textContent, profile);
        const profilePicUrl = await page.evaluate(el => el.querySelector('.lockup__image-container > img').src, profile);
        data.push({ id: uuid(), name: name.trim(), location: location.trim(), jobTitle: jobTitle.trim().split(/at|@/)[0].trim(), profileLink: profileLink.trim(), profilePicUrl: profilePicUrl.trim() });
    }

    let isNextButtonPresent = await page.$('.pagination__quick-link.pagination__quick-link--next');
    if (isNextButtonPresent && data.length < 75) {
        await getProfiles(page, data);
    }
    if (data.length >= 75) {
        return data;
    }
}


const startLinkedInScrape = async (linkedinFilterQuery, searchId) => {
    // const linkedinFilterQuery = {
    //     jobTitle: 'Software Engineer'
    // }
    // const searchId = ''
    // Job Description
    //  let jobTitle = ['Software Engineer', 'Sales Manager'];
    let jobTitle = linkedinFilterQuery?.jobTitle && linkedinFilterQuery.jobTitle.split(',').map(item => item.trim());
    let locations = linkedinFilterQuery?.location && linkedinFilterQuery.location.split(',').map(item => item.trim());
    //  let locations = ['Bengaluru', 'Mumbai'];
    //  let skills = ['Javascript', 'HTML', 'CSS', 'React'];
    let skills = linkedinFilterQuery?.skillAssessments && linkedinFilterQuery.skillAssessments.split(',').map(item => item.trim());
    let education = linkedinFilterQuery?.education && linkedinFilterQuery.education.split(',').map(item => item.trim());
    let currentCompanies = linkedinFilterQuery?.company && linkedinFilterQuery.company.split(',').map(item => item.trim());
    //  let currentCompanies = ['Microsoft', 'Google'];
    //  let pastCompanies = ['Microsoft', 'Google'];
    // let companies = 'HireTest'
    let exprienceInYears = 3;
    let yearOfGraduation = [2021, 2022];
    let keywords = {
        firstname: 'Aakash',
        lastname: '',
        title: '',
        company: '',
        school: '',
    }
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [
            '--window-size=1920,1080',
        ]
    });
    const page = await browser.newPage();
    page.on('console', async (msg) => {
        const msgArgs = msg.args();
        for (let i = 0; i < msgArgs.length; ++i) {
            console.log(await msgArgs[i].jsonValue());
        }
    });
    await page.goto('https://www.linkedin.com/uas/login');
    // await page.waitForTimeout((Math.floor(Math.random() * 6) + 1) * 1000);
    // await page.setViewport({
    //     width: 1200,
    //     height: 1200
    // });
    // await page.waitForSelector('#username');
    // await page.click('#username');
    // await page.type('#username', 'govardhanag2018@email.iimcal.ac.in');
    // await page.type('#password','HireQuotient@456');
    // await page.click('#app__container > main > div.flavor > form > div.login__form_action_container > button');

    const cookies = [{
        'name': 'li_at',
        'value': 'AQEDASptpPsFD2d2AAABhYq2VvEAAAGFrsLa8VYAU_0ZguOE_63qJ5QOqXvjmPAS82bBRbcSG-F9gitm8bIAYdSSy7Ip6uP-tjkc6akcVkt8F14YKL84OY5x2rcm4rMzvqVrgVONi6O-WArdQmCDC2P_'
    }];
    await page.setCookie(...cookies);
    console.log('cookies done');
    await page.evaluate(() => {
        location.replace('https://www.linkedin.com/talent/home');
    })

    // await page.goto('https://www.linkedin.com/talent/home');

    await page.waitForTimeout(5000);

    await page.screenshot({
        path: "./screenshot.png",
        fullPage: true
    });
    
    await page.waitForSelector('.artdeco-button');

    // try {
    //     await page.waitForSelector('.artdeco-button');
    // } catch (error) {
    //     if (error) {
    //         const cookies = [{
    //             'name': 'li_at',
    //             'value': 'AQEDASptpPsA7rH2AAABhYHxMX8AAAGFpf21f1YAjf0gL_Db6PRvYo74Wvk-RcUzWcar6uuz3DpqaddJ8SuTKNUC51L5rLVaJC_3J3-p7ei9S9RDlkzBq048ks-KgAFUzhn4kwv3FVNsbxzMK8lLsG3w'
    //         }];
    //         await page.setCookie(...cookies);
    //         console.log('cookies done');
    //         await page.evaluate(() => {
    //             location.replace('https://www.linkedin.com/talent/home');
    //         }) 
    //     }
    // }
    await page.click('.artdeco-button');
    await page.waitForTimeout(5000);
    const advanceFilterSelector = '#application-wrapper > div.loading-overlay > div > header > div.global-nav__bottom > ul > li:nth-child(1) > button';
    await page.waitForSelector(advanceFilterSelector);
    await page.click(advanceFilterSelector);
    await page.waitForSelector('#search-wrapper > section.advanced-search > main > div > section > div.facets-container__pinned.facets-container__pinned--compact');
    await page.waitForSelector('.facet-edit-button');
    const filterBtnCollection = await page.$$('.facet-edit-button');
    console.log(filterBtnCollection, '-----Btns');
    //  await filterBtnCollection[8].click(); // Job Titles
    //  await page.waitForSelector('.simple-form > div > div > div > div > input');

    if (Array.isArray(jobTitle) && jobTitle.length > 0) {
        await filterBtnCollection[8].click(); // Job Titles
        await page.waitForSelector('.simple-form > div > div > div > div > input');
        for (let title of jobTitle) {
            // await page.waitForSelector('.simple-form > div > div > div > div > input');
            await page.type('.simple-form > div > div > div > div > input', title);
            await page.keyboard.press('Enter');
        }
        await page.mouse.click(800, 700);
    }


    if (Array.isArray(locations) && locations.length > 0) {
        await filterBtnCollection[9].click(); // locations

        await page.waitForSelector('.simple-form > div > div > div > div > input');

        for (let location of locations) {
            await page.type('.simple-form > div > div > div > div > input', location);
            await page.waitForSelector('.artdeco-typeahead__result');
            const autoSuggestionArr = await page.$$('.artdeco-typeahead__result'); // get suggestion list
            await autoSuggestionArr[0].click();
            // await page.keyboard.press('Enter');
        }
        await page.mouse.click(800, 800);
    }

    if (Array.isArray(skills) && skills.length > 0) {

        await filterBtnCollection[10].click(); // skills

        await page.waitForSelector('.simple-form > div > div > div > div > input');

        for (let skill of skills) {
            // await page.waitForSelector('.simple-form > div > div > div > div > input');
            await page.type('.simple-form > div > div > div > div > input', skill);
            await page.waitForSelector('.artdeco-typeahead__result');
            const autoSuggestionArr = await page.$$('.artdeco-typeahead__result'); // get suggestion list
            await autoSuggestionArr[0].click();
            // await page.keyboard.press('Enter');
        }

        await page.mouse.click(800, 800);
    }

    if (Array.isArray(currentCompanies) && currentCompanies.length > 0) {

        await filterBtnCollection[11].click(); // companies
        await page.waitForSelector('.simple-form > div > div > div > div > input');

        for (let companies of currentCompanies) {
            // await page.waitForSelector('.simple-form > div > div > div > div > input');
            await page.type('.simple-form > div > div > div > div > input', companies);
            await page.waitForSelector('.artdeco-typeahead__result');
            const autoSuggestionArr = await page.$$('.artdeco-typeahead__result'); // get suggestion list
            await autoSuggestionArr[0].click();
            // await page.keyboard.press('Enter');
        }

        await page.mouse.click(800, 800);
    }


    await page.waitForSelector('#search-wrapper > section.advanced-search > header > div > button.button-medium-primary.advanced-search__header--actions-primary');
    await page.click('#search-wrapper > section.advanced-search > header > div > button.button-medium-primary.advanced-search__header--actions-primary');

    await page.waitForNavigation();


    await page.waitForSelector('.simple-form > ol > li')
    const profileSelector = '.simple-form > ol > li';
    const profileHandles = await page.$$('.simple-form > ol > li');
    await autoScroll(page);
    // console.log(profileHandles, 'Profiles');

    await page.waitForSelector('.pagination__quick-link-wrapper');

    let data = [];

    browser.addListener('targetcreated', async (target) => {
        if (target.type() !== 'page') {
            newPage = null;
            return;
        }

        // // const properOrigin = 'https://example.org';
        const pageUrl = target.url();
        // // if (new URL(pageUrl).origin === properOrigin) return;

        console.log(`Closing page ${pageUrl}...`);
        newPage = await target.page();
        // await newPage.waitForTimeout(5000);
        // await newPage.close();
        // console.log(`Page ${pageUrl} closed.`);
    });

    profileFetcher(profileHandles, data, browser, 0, page, searchId, 0);

    // for (let [i, profile] of profileHandles.entries()) {
    // const name = await page.evaluate(el => el.querySelector('a').textContent, profile);
    // const location = await page.evaluate(el => el.querySelector('.artdeco-entity-lockup__metadata > div').textContent, profile);
    // //  const profileLink = await page.evaluate(el => el.querySelector('a').href, profile);
    // const jobTitle = await page.evaluate(el => el.querySelector('.artdeco-entity-lockup__subtitle').textContent, profile);
    // const profilePicUrl = await page.evaluate(el => el.querySelector('.lockup__image-container > img').src, profile);

    // // click on profile link
    // await page.evaluate(el => el.querySelector('a').click(), profile);
    // // await page.waitForNavigation({ waitUntil: 'networkidle0' });
    // await page.waitForSelector('.base-slidein__modal.base-slidein__modal--open');
    // // await page.waitForSelector('.base-slidein__modal.base-slidein__modal--open > span.artdeco-hoverable-trigger > button');
    // // await page.click('.base-slidein__modal.base-slidein__modal--open > span.artdeco-hoverable-trigger > button');
    // // await page.waitForSelector('.artdeco-button .artdeco-button--1 .artdeco-button--tertiary .topcard-condensed__bing-button .t-14');
    // await page.waitForTimeout(2000);
    // await page.click('#topcard-public-profile-hoverable-btn');
    // await page.waitForTimeout(2000);
    // const profileLink = await page.evaluate(() => document.querySelector('a.topcard-condensed__public-profile-hovercard').getAttribute('href'));
    // console.log(profileLink);
    // await page.waitForTimeout(2000);
    // await page.click('.experience-card a.logo-container__link');
    // await page.waitForTimeout(5000);
    // const companyWebsite = await page.evaluate(() => {
    //     const anchor = document.querySelector('.org-top-card-primary-actions__inner > a.org-top-card-primary-actions__action');
    //     // const anchor = document.querySelector('.org-overflow-menu ul li a.org-overflow-menu__item')
    //     return anchor.getAttribute('href');
    // });

    // emailFinder({ name: name, domain: extractRootDomain(companyWebsite) })
    //     .then(async function (email) {
    //         createNewCandidate(pvName, email, profileUrl, userSearchId, user);
    //         searchLinkedin(page, browser, searchKey, userSearchId, index + 1, user);
    //     })
    //     .catch(async function (err) {
    //         console.log(err);
    //         searchLinkedin(page, browser, searchKey, userSearchId, index + 1, user);
    //     })
    //  // click on profile link
    //  await page.click(`.simple-form > ol > li:nth-child(${i + 1}) > a`);

    // const filters = await page.evaluate(filterSelector => {
    //     return [...document.querySelectorAll(filterSelector)].map(button => {
    //         const btnAction = button.textContent.split('|')[0].trim();
    //         return `${btnAction}`;
    //     })
    // }, filterSelector)
    // let exprienceArray = []
    // const exprienceSelector = '.history-group:nth-child(1) > .history-group__list-items > li';

    // const exprienceNewArray = await page.evaluate(async () => {
    //     let exprienceArray = await page.evaluate((exprienceSelector) => {
    //         return [...document.querySelectorAll(exprienceSelector)].map(exp => {
    //             const expTitle = exp.querySelector('span').textContent;
    //             return `${expTitle}`;
    //         })
    //     }, exprienceSelector);
    //     return exprienceArray;
    // }, profile)


    // console.log(exprienceNewArray, 'exprienceNewArray')

    // const exprienceArrayElement = await page.$$eval(el => el.querySelector(`.simple-form > ol > li:nth-child(${i+1}) >.history-group:nth-child(1) > .history-group__list-items > li`), profile);
    // const exprienceArrayElement = await page.$$(`.simple-form > ol > li:nth-child(${i+1}) > .history-group:nth-child(1) > .history-group__list-items > li`); 
    // console.log(exprienceArrayElement, 'exprienceArrayElement')
    // const exprienceArray = [];
    // for (let exp of exprienceArrayElement) {
    //     const expTitle = await page.evaluate(el => el.querySelector('span').textContent, exp);
    //     exprienceArray.push(expTitle.trim());
    // }
    // const educationArrayElement = await page.$$('.education-group > .education-group__list-items > li');


    // let data = await page.evaluate(async (el) => {
    //     let elements = await page.$$(`.history:nth-child(${i+1}) > .history-group:nth-child(1) > .history-group__list-items > li`);
    //     console.log(elements, 'elements')
    // for (const item of elements) {
    //     const expTitle = await item.evaluate(elm => elm.textContent, item);
    //     console.log(expTitle, 'expTitle')
    //     exprienceArray.push(expTitle.trim());
    // }
    // }, profile);
    // let expElements = await page.$$(`div.history > div:nth-child(1)`);

    // for (const item of expElements) {
    //     const expTitle = await page.evaluate(el => el.querySelector('ol > li').textContent, item);
    //     console.log(expTitle, 'expTitle')
    //     exprienceArray.push(expTitle.trim());

    // }

    //  console.log(expElements, 'elements')
    //  console.log({ name : name.trim(), location : location.trim(), jobTitle : jobTitle.trim().split(/at|@/)[0].trim(), });
    // data.push({ id: uuid(), name: name.trim(), location: location.trim(), jobTitle: jobTitle.trim().split(/at|@/)[0].trim(), profileLink: profileLink.trim(), profilePicUrl: profilePicUrl.trim() });
    // }

    //  let isNextButtonPresent = await page.$('.pagination__quick-link.pagination__quick-link--next');

    //  if (isNextButtonPresent) {
    //      await getProfiles(page, data);
    //  }
    // await browser.close();
    // return data;
}

async function profileFetcher(profileHandles, data, browser, i, page, searchId, pageCount) {
    if (i < profileHandles.length) {
        const name = await page.evaluate(el => el.querySelector('a').textContent, profileHandles[i]);
        const location = await page.evaluate(el => el.querySelector('.artdeco-entity-lockup__metadata > div').textContent, profileHandles[i]);
        //  const profileLink = await page.evaluate(el => el.querySelector('a').href, profile);
        const jobTitle = await page.evaluate(el => el.querySelector('.artdeco-entity-lockup__subtitle').textContent, profileHandles[i]);
        const profilePicUrl = await page.evaluate(el => el.querySelector('.lockup__image-container > img').src, profileHandles[i]);

        // click on profile link
        await page.evaluate(el => el.querySelector('a').click(), profileHandles[i]);
        await page.waitForSelector('.base-slidein__modal.base-slidein__modal--open');
        await page.waitForTimeout(2000);
        let profileLink = '';
        try {
            await page.click('#topcard-public-profile-hoverable-btn');
            await page.waitForTimeout(2000);
            profileLink = await page.evaluate(() => document.querySelector('a.topcard-condensed__public-profile-hovercard').getAttribute('href'));
            console.log(profileLink);
            await page.waitForTimeout(2000);

            try {
                await page.waitForSelector('.experience-card a.logo-container__link');
                console.log('aya');
                await page.evaluate(() => {
                    document.querySelector('.experience-card a.logo-container__link').click();
                });
                await page.waitForTimeout(3000);
                await newPage.waitForTimeout(3000);

                let companyWebsite;
                try {
                    await newPage.waitForSelector('.org-top-card-primary-actions__inner > a.org-top-card-primary-actions__action');
                    console.log('aya');
                    companyWebsite = await newPage.evaluate(() => {
                        const anchor = document.querySelector('.org-top-card-primary-actions__inner > a.org-top-card-primary-actions__action');
                        return anchor.getAttribute('href');
                    });

                    console.log(companyWebsite);

                    await newPage.close();

                    await page.waitForTimeout(3000);
                    console.log('click krenge')
                    await page.mouse.click(50, 300);
                    emailFinder({ name: name.trim(), domain: extractRootDomain(companyWebsite) })
                        .then(function (email) {
                            // data.push({ id: uuid(), name: name.trim(), location: location.trim(), jobTitle: jobTitle.trim().split(/at|@/)[0].trim(), profileLink: profileLink.trim(), profilePicUrl: profilePicUrl.trim(), email });
                            saveToDb({ id: uuid(), name: name.trim(), location: location.trim(), jobTitle: jobTitle.trim().split(/at|@/)[0].trim(), profileLink: profileLink.trim(), profilePicUrl: profilePicUrl.trim(), email }, searchId);
                            profileFetcher(profileHandles, data, browser, i + 1, page, searchId, pageCount);
                        })
                        .catch(function (err) {
                            // searchLinkedin(page, browser, searchKey, userSearchId, index + 1, user);
                            // data.push({ id: uuid(), name: name.trim(), location: location.trim(), jobTitle: jobTitle.trim().split(/at|@/)[0].trim(), profileLink: profileLink.trim(), profilePicUrl: profilePicUrl.trim(), email: '' });
                            saveToDb({ id: uuid(), name: name.trim(), location: location.trim(), jobTitle: jobTitle.trim().split(/at|@/)[0].trim(), profileLink: profileLink.trim(), profilePicUrl: profilePicUrl.trim(), email: '' }, searchId);
                            profileFetcher(profileHandles, data, browser, i + 1, page, searchId, pageCount);
                        })
                } catch (e) {
                    saveToDb({ id: uuid(), name: name.trim(), location: location.trim(), jobTitle: jobTitle.trim().split(/at|@/)[0].trim(), profileLink: profileLink.trim(), profilePicUrl: profilePicUrl.trim(), email: '' }, searchId);
                    profileFetcher(profileHandles, data, browser, i + 1, page, searchId, pageCount);
                }
            } catch (e) {
                saveToDb({ id: uuid(), name: name.trim(), location: location.trim(), jobTitle: jobTitle.trim().split(/at|@/)[0].trim(), profileLink: profileLink.trim(), profilePicUrl: profilePicUrl.trim(), email: '' }, searchId);
                profileFetcher(profileHandles, data, browser, i + 1, page, searchId, pageCount);
            }
        } catch (e) {
            profileFetcher(profileHandles, data, browser, i + 1, page, searchId, pageCount);
        }

        // await newPage.waitForNavigation({waitUntil: "domcontentloaded"});
    } else {
        // if (pageCount < 3) {
        //     let isNextButtonPresent = await page.$('.pagination__quick-link.pagination__quick-link--next');
        //     if (isNextButtonPresent) {
        //         await page.click('.pagination__quick-link.pagination__quick-link--next');
        //         await page.waitForNavigation();
        //         await autoScroll(page);
        //         const profileHandles = await page.$$('.simple-form > ol > li');
        //         profileFetcher(profileHandles, data, browser, 0, page, searchId, pageCount + 1);
        //     }
        // } else {
        await browser.close();
        // }
        // return data;
    }
}

async function saveToDb(userData, searchId) {
    const foundSearch = await Search.findById(searchId);
    foundSearch.linkedinSearchResults.push(userData);
    foundSearch.save();
}

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

module.exports = {
    startLinkedInScrape
}