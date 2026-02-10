<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-md rounded-xl bg-[#023e8a4D] p-6 text-white shadow-lg">
		<h2 class="mb-4 text-center text-2xl font-semibold">
			<slot name="title" />
		</h2>

		<slot />

		<div class="mt-4 text-center text-sm">
			<slot name="switch" />
		</div>
	</div>
</div>
