/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};

exports.about = function (req, res) {
    res.render('about', {
        experience: {
            current: {
                name: 'Slalom Consulting',
                image: {
                    src: '/images/logo/slalom.png',
                    href: 'http://www.slalom.com'
                },
                start: 'November 2013',
                description: 'Headquartered in Seattle, Washington, Slalom Consulting has rapidly grown to more than 2,200 consultants and helps companies from the Fortune 500 to emerging businesses. We deliver award–winning solutions and innovation through a national network of local offices across 14 North American cities. Slalom can take on a full end–to–end project or only the key portion where we will add the most value. We can bring our own proven methods, work within a client’s framework, or work with a client to create a new delivery method. We want results for our clients, and we typically structure projects with smaller teams that deliver those results faster. Slalom has earned numerous national, regional, and local awards from our clients, partners, the media, and community organizations. Our executives are also frequently recognized on an individual basis for their leadership and business acumen. ',
                details: ['bullet a', 'bullet b']
            },
            previous: [{
                name: 'Credera',
                image: {
                    src: '/images/logo/credera.jpg',
                    href: 'http://www.credera.com'
                },
                start: 'August 2011',
                end: 'October 2013',
                description: 'Credera is a full–service management and technology consulting firm. Our clients range from Fortune 1,000 companies to emerging industry leaders. We provide expert, objective advice to help solve complex business and technology challenges. Our deep capabilities in strategy, organization, process, analytics and technology help our clients improve their performance. Clients depend on our ability to anticipate, recognize and address their specific needs.',
                details: ['bullet a', 'bullet b']
            }, {
                name: 'Dallas Pedicabs',
                image: {
                    src: '/images/logo/pedicabs.png',
                    href: 'http://www.dallaspedicabs.com'
                },
                start: 'February 2013',
                end: 'May 2013',
                description: 'Since our inception in early 2011 we have been trying to make sustainable transportation in Dallas a reality, while providing an enjoyable experience to all of our patrons. Whether it is a ride to dinner, a bar, friend’s apartment or just to grab a bite to eat, a ride with Dallas Pedicabs is the right decision. We also cater to groups, weddings, sporting events, parking lots and awesome historic tours of certain areas of Dallas. As a company, our mission is to provide fun transportation for the residents of Dallas around Uptown, deter drunk driving, and bring a new sustainable business to the area.',
                details: ['bullet a', 'bullet b']
            }, {
                name: 'Tampa Bay Radiation Oncology',
                image: {
                    src: '/images/logo/tbro.png',
                    href: 'http://www.tbropa.com'
                },
                start: 'May 2010',
                end: 'July 2010',
                description: 'Tampa Bay Radiation Oncology (TBRO) formed in 2003, is a locally owned and physician managed organization committed to providing experienced, state of the art cancer treatments in a caring and professional manner. We practice in four free standing clinics, strategically located throughout the Tampa Bay Area to offer convenience to patients and state of the art planning capabilities offered at other major academic cancer centers across the country, so patients can receive their cancer care at home with support of family and friends.',
                details: ['bullet a', 'bullet b']
            }]
        },
        education:  {
            name: 'Southern Methodist University',
            image: {
                src: 'images/logo/smu.png',
                href: 'http://www.smu.edu'
            },
            start: 'August 2007',
            end: 'May 2011',
            description: 'Lorem 2',
            details: ['bullet 1', 'bullet 2']
        }
    });
};
