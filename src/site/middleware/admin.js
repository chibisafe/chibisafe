export default function({ store, redirect }) {
	// If the user is not authenticated
	if (!store.state.user) return redirect('/login');
	if (!store.state.user.isAdmin) return redirect('/dashboard');
}
