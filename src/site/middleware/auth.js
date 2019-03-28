export default function({ store, redirect }) {
	// If the user is not authenticated
	if (!store.state.loggedIn) {
		return redirect('/login');
	}
}
