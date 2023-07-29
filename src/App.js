import React, { useState } from "react";
import $ from 'jquery';
import skillsJson from './all_skills.json'
import Loading from './components/Loading'
import Table from "./components/Table";


const allSkills = skillsJson.all_skills;
const api = {
	base: "https://server.lazypelt.com/api/"
}

function capitalizeFirstLetter(arr) {
	var result = [];
	arr.forEach(s => {
		result.push(s.charAt(0).toUpperCase() + s.slice(1))
	})
	return result;
}

function buildInventoryDiv(inv) {
	var result = "";
	var items = 0;

	for (const key in inv) {
		if (inv[key]) {
			items++;
			result += `<div className='col-sm-4'>
				<p>
						<b>
							${capitalizeFirstLetter(key.split("_")).join(" ")}
							
						</b> ${inv[key].length >= 16 ? inv[key].substring(0, 16) : inv[key]}
				</p>
			</div>`
		}
	}
	if (items == 0) {
		result += `<div className='col-sm-4'>
				<p>
					No items in inventory
				</p>
			</div>`
	}
	return result;
}

function buildActivityDiv(u) {
	var result = "";
	u.calendar.sort(function (a, b) { return a.timestamp - b.timestamp }).reverse();
	u.calendar.forEach(entry => {
		var skill = allSkills.filter(s => s.id == entry.skill_id)[0];

		result += `<div className='col-sm-4'>
				<p>
						<b>
							${new Date(entry.datetime).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}:
							
						</b> ${skill ? skill.name : "unknown lesson/practice"} ${(entry.event_type ? "(" + entry.event_type + ")" : "")} || <b>${entry.improvement} XP</b>
				</p>
			</div>`;
	});

	return result;
}


function buildLangTableDiv(courses) {
	var result = "";
	courses.sort(function (a, b) { return b.xp - a.xp });
	var tableCourses = [];
	courses
		.filter((c) => c.xp > 0)
		.forEach((c) => {
			var tableCourse = {
				toLang: LangString[c.learningLanguage.toLowerCase()] ? LangString[c.learningLanguage.toLowerCase()] : c.learningLanguage.toUpperCase(),
				fromLang: LangString[c.fromLanguage.toLowerCase()] ? LangString[c.fromLanguage.toLowerCase()] : c.fromLanguage.toUpperCase(),
				toFlag:
					`<svg class="svgFlag" viewBox="10 ${66 * (FlagSVG[c.learningLanguage.toLowerCase()] ? FlagSVG[c.learningLanguage.toLowerCase()] : FlagSVG["world"])} 25 66">
						<image
							height="3168"
							href="https://d35aaqx5ub95lt.cloudfront.net/vendor/87938207afff1598611ba626a8c4827c.svg"
							width="82"
							xlinkHref="https://d35aaqx5ub95lt.cloudfront.net/vendor/87938207afff1598611ba626a8c4827c.svg"
						/>
					</svg>`,
				fromFlag: 
					`<svg class="svgFlag" viewBox="10 ${66 * ((FlagSVG[c.fromLanguage.toLowerCase()] || FlagSVG[c.fromLanguage.toLowerCase()] === 0) ? FlagSVG[c.fromLanguage.toLowerCase()] : FlagSVG["world"])} 25 66">
						<image
							height="3168"
							href="https://d35aaqx5ub95lt.cloudfront.net/vendor/87938207afff1598611ba626a8c4827c.svg"
							width="82"
							xlinkHref="https://d35aaqx5ub95lt.cloudfront.net/vendor/87938207afff1598611ba626a8c4827c.svg"
						/>
					</svg>`,
				xp: c.xp
			};
			tableCourses.push(tableCourse);
		});


	const columns = [
		{ label: "", accessor: "toFlag", sortable: false },
		{ label: "Language", accessor: "toLang", sortable: true },
		{ label: "From", accessor: "fromLang", sortable: true },
		{ label: "", accessor: "fromFlag", sortable: false },
		{ label: "XP", accessor: "xp", sortable: true, sortbyOrder: "desc" },
	];

	result = <Table data={tableCourses} columns={columns} />

	return result;
}


const FlagSVG = {
	"en": 0,
	"es": 1,
	"fr": 2,
	"de": 3,
	"ja": 4,
	"it": 5,
	"ko": 6,
	"zh": 7,
	"zh-hk": 7,
	"ru": 8,
	"pt": 9,
	"tr": 10,
	"nl": 11,
	"nl-nl": 11,
	"sv": 12,
	"ga": 13,
	"el": 14,
	"he": 15,
	"pl": 16,
	"no-bo": 17,
	"nb": 17,
	"no": 17,
	"vi": 18,
	"da": 19,
	"hv": 20,
	"ro": 21,
	"sw": 22,
	"eo": 23,
	"hu": 24,
	"cy": 25,
	"uk": 26,
	"kl": 27,
	"tlh": 27,
	"cs": 28,
	"hi": 29,
	"id": 30,
	"hw": 31,
	"nv": 32,
	"ar": 33,
	"ca": 34,
	"th": 35,
	"gn": 36,
	"world": 37,
	"duo": 38,
	"settings": 39,
	"teacher": 40,
	"la": 41,
	"gd": 42,
	"fi": 43,
	"yi": 44,
	"ht": 45,
	"tl": 46,
	"zu": 47
};

const LangString = {
	"en": "English",
	"es": "Spanish",
	"fr": "French",
	"de": "German",
	"ja": "Japanese",
	"it": "Italian",
	"ko": "Korean",
	"zh": "Chinese",
	"zh-hk": "Cantonese",
	"ru": "Russian",
	"pt": "Portuguese",
	"tr": "Turkish",
	"nl": "Dutch",
	"nl-nl": "Dutch",
	"sv": "Swedish",
	"ga": "Irish",
	"el": "Greek",
	"he": "Hebrew",
	"pl": "Polish",
	"no-bo": "Norwegian",
	"nb": "Norwegian",
	"no": "Norwegian",
	"vi": "Vietnamese",
	"da": "Danish",
	"hv": "High Valyrian",
	"ro": "Romanian",
	"sw": "Swedish",
	"eo": "Esperanto",
	"hu": "Hungarian",
	"cy": "Welsh",
	"uk": "Ukrainian",
	"kl": "Klingon",
	"tlh": "Klingon",
	"cs": "Czech",
	"hi": "Hindi",
	"id": "Indonesian",
	"hw": "Hawaiian",
	"nv": "Navajo",
	"ar": "Arabic",
	"ca": "Catalan",
	"th": "Thai",
	"gn": "Guarani",
	"la": "Latin",
	"gd": "Scottish Gaelic",
	"fi": "Finnish",
	"yi": "Yiddish",
	"ht": "Haitian",
	"tl": "Tagalog",
	"zu": "Zulu",
	"xh": "Xhosa"
};

function App() {

	const [query, setQuery] = useState('');
	const [user, setUser] = useState({});
	const [invDiv, setInvDiv] = useState('');
	const [langTableRows, setLangTableRows] = useState('');
	const [activityDiv, setActivityDiv] = useState('');
	const [userLoading, setUserLoading] = useState(false);

	const search = evt => {
		if (evt.key == "Enter" || evt.type == "click") {

			var expr = /^[a-zA-Z0-9._\-]*$/;
			if (!expr.test(query)) {
				setUser({ username: "invalid_input" }); //add invalid input
				setQuery('');
				return;
			}

			setUserLoading(true);
			setUser({});
			fetch(api.base + query)
				.then(res => res.json())
				.then(result => {
					if (result) {

						for (const key in result.language_data) {
							result.language_data.currentlang = result.language_data[key];
						}

						setInvDiv(buildInventoryDiv(result.inventory));

						setLangTableRows(buildLangTableDiv(result.alt.courses));

						setActivityDiv(buildActivityDiv(result));

						setUserLoading(false);

						setUser(result);
					}
					else {
						setUser({ username: "user_not_found" });
					}
					setQuery('');
				});
		}
	}


	return (
		<div>
			<main>
				<div className="search-box d-flex justify-content-center tab">
					<input
						autoFocus={true}
						type="text"
						className="search-bar form-control"
						placeholder="Duolingo Username"
						onChange={e => setQuery(e.target.value)}
						value={query}
						onKeyUp={search}
					/>

					<button className="btn btn-outline-primary" style={{ height: "44px", marginTop: "-25px" }} onClick={search}>Search</button>
				</div>

				{userLoading ?
					(<Loading />)
					: ('')
				}

				{(typeof user.username != "undefined") ?
					(user.username === "user_not_found") ?
						(
							<div>
								<section style={{ backgroundcolor: "#101010" }}>
									<div className="container py-5" style={{ justifyContent: "center", textAlign: "center" }}>

										<div>User not found. Note: Private and age restricted users and those in classrooms with restricted privacy settings cannot be found.</div>
									</div>
								</section>
							</div>
						) :
						(user.username === "invalid_input") ?
							(
								<div>
									<section style={{ backgroundcolor: "#101010" }}>
										<div className="container py-5" style={{ justifyContent: "center", textAlign: "center" }}>

											<div>Invalid input, please try a valid username.</div>
										</div>
									</section>
								</div>

							) : (
								<div>
									<section style={{ backgroundcolor: "#101010" }}>
										<div className="container py-5">
											<div className="row">
												<div className="col-lg-3">
													<div className="card mb-4">
														<div className="card-body text-center">
															<img src={`${user.avatar}/xlarge`} alt="avatar" className="rounded-circle img-fluid" style={{ width: "150px" }} />
															<br />
															<h4 className="mt-3"><a href={`https://www.duolingo.com/profile/${user.username}`} target="_blank">{user.username}</a></h4>
															{(user.username != user.fullname && (user.fullname)) ? (
																<p className="text-muted mb-1">{user.fullname}</p>
															) : ('')}
															<p className="mb-2">ID: {user.id}</p>
															<p className="mb-2">Joined on: {new Date(user.alt.creationDate * 1000).toLocaleDateString("de-DE")}</p>
															<hr />
															<p className="my-0"><a href={`https://www.duome.eu/${user.username}`} target="_blank">Duome</a></p>
														</div>
													</div>
												</div>

												<div className="col-lg-9">
													<div className="card mb-4">
														<div className="card-body">
															{(user.bio) ? (
																<div>
																	<div className="row">
																		<div className="col-sm-3">
																			<p className="mb-0"><b>Bio</b></p>
																		</div>
																		<div className="col-sm-9">
																			<p className="mb-0">{user.bio}</p>
																		</div>
																	</div>
																	<hr />
																</div>
															) : ('')}

															<div className="row">
																<div className="col-sm-3">
																	<p className="mb-0"><b>Learning</b></p>
																</div>
																<div className="col-sm-9">
																	<p className="mb-0">{`${user.learning_language_string} from ${user.ui_language.toUpperCase()}` + ((typeof user.language_data.currentlang.next_lesson === "undefined" || user.language_data.currentlang.next_lesson === null) ? " (Path complete)" : " (Path incomplete)")} </p>
																</div>
															</div>
															<hr />

															<div className="row">
																<div className="col-sm-3">
																	<p className="mb-0"><b>Lingots</b></p>
																</div>
																<div className="col-sm-9">
																	<p className="mb-0">{user.rupees}</p>
																</div>
															</div>
															<hr />

															<div className="row">
																<div className="col-sm-3">
																	<p className="mb-0"><b>Total XP</b></p>
																</div>
																<div className="col-sm-9">
																	<p className="mb-0">{user.alt.totalXp}</p>
																</div>
															</div>
															<hr />

															<div className="row">
																<div className="col-sm-3">
																	<p className="mb-0"><b>Super Subscriber</b></p>
																</div>
																<div className="col-sm-9">
																	<p className="mb-0">{user.alt.hasPlus ? "Yes" : "No"}</p>
																</div>
															</div>
															<hr />

															<div className="row">
																<div className="col-sm-3">
																	<p className="mb-0"><b>Daily XP Goal</b></p>
																</div>
																<div className="col-sm-9">
																	<p className="mb-0">{user.daily_goal}</p>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col">
													<div className="card mb-4">
														<div className="card-header mb-0 pb-0" id="headerlessonstats" data-toggle="collapse" data-target="#collapseLessonStats" aria-expanded="true" aria-controls="collapseLessonStats">
															<h5>
																Average Lesson Stats (last {user.XPStats.length} Days)
															</h5>
														</div>
														<div id="collapseLessonStats" className="collapse show" aria-labelledby="headerlessonstats">
															<div className="card-body">
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Average Time per Lesson: </b>{Math.round(user.XPStats.reduce((n, { totalSessionTime }) => n + totalSessionTime, 0) / user.XPStats.reduce((n, { numSessions }) => n + numSessions, 0))} seconds</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Average Lessons per Day: </b>{Math.round(user.XPStats.reduce((n, { numSessions }) => n + numSessions, 0) / user.XPStats.length)}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Average XP per Day: </b>{Math.round(user.XPStats.reduce((n, { gainedXp }) => n + gainedXp, 0) / user.XPStats.length)}</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="row">
												<div className="col">
													<div className="card mb-4">
														<div className="card-header mb-0 pb-0" id="headerstreak" data-toggle="collapse" data-target="#collapseStreak" aria-expanded="true" aria-controls="collapseStreak">
															<h5>
																Streak
															</h5>
														</div>
														<div id="collapseStreak" className="collapse show" aria-labelledby="headerstreak">
															<div className="card-body">
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Current Streak: </b>{user.site_streak}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Streak extended today: </b>{user.streak_extended_today ? "Yes" : "No"}</p>
																	</div>
																	<div className="col-sm-4">
																	</div>
																</div>
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Last Streak: </b>{user.last_streak.length}</p>
																	</div>
																	<div className="col-sm-4">

																		<p><b>Last Extended: </b>{new Date(user.last_streak.last_reached_goal).toLocaleDateString("de-DE")}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Streak Repair Available: </b>{user.streak_extended_today ? "Yes" : "No"}</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="row">
												<div className="col">
													<div className="card mb-4">
														<div className="card-header mb-0 pb-0" id="headerPrivacy" data-toggle="collapse" data-target="#collapsePrivacy" aria-expanded="true" aria-controls="collapsePrivacy">
															<h5>
																Privacy
															</h5>
														</div>
														<div id="collapsePrivacy" className="collapse" aria-labelledby="headerPrivacy">
															<div className="card-body">
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Discussions: </b>{user.privacy_settings.disable_discussions ? "Disabled" : "Enabled"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Mature Words/Topics: </b>{user.privacy_settings.disable_mature_words ? "Disabled" : "Enabled"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Personalized Ads: </b>{user.privacy_settings.disable_personalized_ads ? "Disabled" : "Enabled"}</p>
																	</div>
																</div>
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Friends Quests: </b>{user.privacy_settings.disable_friends_quests ? "Disabled" : "Enabled"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Social Features: </b>{user.privacy_settings.disable_social ? "Disabled" : "Enabled"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Leaderboards: </b>{user.privacy_settings.disable_leaderboards ? "Disabled" : "Enabled"}</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="row">
												<div className="col">
													<div className="card mb-4">
														<div className="card-header mb-0 pb-0" id="headerInventory" data-toggle="collapse" data-target="#collapseInventory" aria-expanded="true" aria-controls="collapseInventory">
															<h5>
																Inventory
															</h5>
														</div>
														<div id="collapseInventory" className="collapse" aria-labelledby="headerInventory">
															<div className="card-body">
																<div className="row" dangerouslySetInnerHTML={{ __html: invDiv }}>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="row">

												<div className="col">
													<div className="card mb-4">
														<div className="card-header mb-0 pb-0" id="headerClassrooms" data-toggle="collapse" data-target="#collapseClassrooms" aria-expanded="true" aria-controls="collapseClassrooms">
															<h5>
																Classrooms
															</h5>
														</div>
														<div id="collapseClassrooms" className="collapse" aria-labelledby="headerClassrooms">
															<div className="card-body">
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Number of classrooms: </b>{user.num_classrooms}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Owns a classroom: </b>{user.is_observer ? "Yes" : "No"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>In someone else's classroom: </b>{user.has_observer ? "Yes" : "No"}</p>
																	</div>
																</div>
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Students in classroom(s): </b>{user.num_observees}</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="row">
												<div className="col">
													<div className="card mb-4">
														<div className="card-header mb-0 pb-0" id="headerConnections" data-toggle="collapse" data-target="#collapseConnections" aria-expanded="true" aria-controls="collapseConnections">
															<h5>
																Connections
															</h5>
														</div>
														<div id="collapseConnections" className="collapse" aria-labelledby="headerConnections">
															<div className="card-body">
																<div className="row">
																	<div className="row">
																		<div className="col-sm-4">
																			<p><b>Google Connected: </b>{user.alt.hasGoogleId ? "Yes" : "No"}</p>
																		</div>
																		<div className="col-sm-4">
																			<p><b>Facebook Connected: </b>{user.alt.hasFacebookId ? "Yes" : "No"}</p>
																		</div>
																		<div className="col-sm-4">
																			<p><b>Phone Number Connected: </b>{user.alt.hasPhoneNumber ? "Yes" : "No"}</p>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="row">
												<div className="col">
													<div className="card mb-4">
														<div className="card-header mb-0 pb-0" id="headerOther" data-toggle="collapse" data-target="#collapseOther" aria-expanded="true" aria-controls="collapseOther">
															<h5>
																Other
															</h5>
														</div>
														<div id="collapseOther" className="collapse" aria-labelledby="headerOther">
															<div className="card-body">
																<div className="row">

																	{(user.alt.globalAmbassadorStatus.types) ? (

																		<div className="col-sm-4">
																			<p><b>Global Ambassador: </b>{user.alt.globalAmbassadorStatus.types[0]}</p>
																		</div>
																	) : ('')}
																	<div className="col-sm-4">
																		<p><b>Email Verified: </b>{user.email_verified ? "Yes" : "No"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Moderation Tools: </b>{user.alt.canUseModerationTools ? "Yes" : "No"}</p>
																	</div>
																</div>
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Trial Account: </b>{user.trial_account ? "Yes" : "No"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Admin Account: </b>{user.admin ? "Yes" : "No"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Account Deactivated: </b>{user.deactivated ? "Yes" : "No"}</p>
																	</div>
																</div>
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Google Connected: </b>{user.alt.hasGoogleId ? "Yes" : "No"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Facebook Connected: </b>{user.alt.hasFacebookId ? "Yes" : "No"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Phone Number Connected: </b>{user.alt.hasPhoneNumber ? "Yes" : "No"}</p>
																	</div>
																</div>
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Upload Self Service: </b>{user.uploadselfservice ? "Yes" : "No"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Delete Permissions: </b>{user.deletepermissions ? "Yes" : "No"}</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Freeze Permissions: </b>{user.freezepermissions ? "Yes" : "No"}</p>
																	</div>
																</div>
																<div className="row">
																	<div className="col-sm-4">
																		<p>
																			<b>Roles: </b>{user.alt.roles.join(", ")}
																		</p>
																	</div>
																	<div className="col-sm-4">
																		<p><b>Motivation: </b>{user.alt.motivation}</p>
																	</div>
																</div>
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>Dict Base URL: </b><a href={`${user.dict_base_url}`}>{user.dict_base_url}</a></p>
																	</div>
																	<div className="col-sm-8">
																		<p><b>Referral Link: </b><a href={`${user.invite_url}`}>{user.invite_url}</a></p>
																	</div>
																</div>
																<div className="row">
																	<div className="col-sm-4">
																		<p><b>TTS CDN URL: </b><a href={`${user.tts_cdn_url}`}>{user.tts_cdn_url}</a></p>
																	</div>
																	<div className="col-sm-8">
																		<p><b>TTS Base URL: </b><a href={`${user.tts_base_url}`}>{user.tts_base_url}</a></p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="row">
												<div className="col">
													<div className="card mb-4">
														<div className="card-header mb-0 pb-0" id="headerLanguages" data-toggle="collapse" data-target="#collapseLanguages" aria-expanded="true" aria-controls="collapseLanguages">
															<h5>
																Languages
															</h5>
														</div>
														<div id="collapseLanguages" className="collapse" aria-labelledby="headerLanguages">
															<div className="card-body">
																{langTableRows}
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="row">
												<div className="col">
													<div className="card mb-4">
														<div className="card-header mb-0 pb-0" id="headeractivity" data-toggle="collapse" data-target="#collapseActivity" aria-expanded="true" aria-controls="collapseActivity">
															<h5>
																Activity
															</h5>
														</div>
														<div id="collapseActivity" className="collapse" aria-labelledby="headeractivity">
															<div className="card-body">
																<div className="row" dangerouslySetInnerHTML={{ __html: activityDiv }}>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>


										</div>
									</section >
								</div >
							) : ('')
				}

			</main >
		</div >

	);
}

export default App;