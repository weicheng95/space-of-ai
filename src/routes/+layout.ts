export const load = async ({ data, fetch, depends }) => {
	// depends('supabase:auth');

	// const supabase = createBrowserClient(PRIVATE_SUPABASE_URL, PRIVATE_SUPABASE_ANON_KEY, {
	// 	global: {
	// 		fetch
	// 	},
	// 	cookies: {
	// 		get(key) {
	// 			if (!isBrowser()) {
	// 				return JSON.stringify(data.session);
	// 			}

	// 			const cookie = parse(document.cookie);
	// 			return cookie[key];
	// 		}
	// 	}
	// });

	// let session: Session | null = null;
	// const { data: getUserData } = await supabase.auth.getUser();
	// if (getUserData.user == null) {
	// 	session = null;
	// } else {
	// 	const userSession = await supabase.auth.getSession();
	// 	session = userSession.data.session;
	// }

	// return { supabase, session };
	// return { supabase };
};
