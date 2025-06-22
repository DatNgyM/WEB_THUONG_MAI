<?php
/**
 * Page Controller
 * Serve static HTML pages
 */
class PageController extends Controller
{
    /**
     * Serve HTML page
     */
    public function index($page = 'index')
    {
        $this->servePage($page);
    }

    /**
     * Serve specific page
     */
    public function show($page)
    {
        $this->servePage($page);
    }

    /**
     * Serve HTML file
     */
    private function servePage($page)
    {
        // Sanitize page name
        $page = preg_replace('/[^a-zA-Z0-9_-]/', '', $page);

        // Define available pages
        $pages = [
            'index' => 'index.html',
            'login' => 'login.html',
            'product' => 'product.html',
            'productdetails' => 'productdetails.html',
            'cart' => 'cart.html',
            'checkout' => 'checkout.html',
            'account' => 'accountsetting.html',
            'profile' => 'accountProfile.html',
            'seller' => 'sellerPortal.html',
            'upgrade' => 'upgradeAccount.html',
            'success' => 'orderSuccess.html',
            'chatbot' => 'chatbot.html'
        ];

        // Check if page exists
        if (!isset($pages[$page])) {
            $this->notFound();
            return;
        }

        $htmlFile = ROOT_PATH . '/Page/' . $pages[$page];

        if (file_exists($htmlFile)) {
            // Set proper headers
            header('Content-Type: text/html; charset=UTF-8');
            header('Cache-Control: no-cache, must-revalidate');

            // Read and output file
            readfile($htmlFile);
            exit;
        } else {
            $this->notFound();
        }
    }

    /**
     * Handle 404 not found
     */
    private function notFound()
    {
        http_response_code(404);
        echo '<h1>404 - Page Not Found</h1>';
        echo '<p>The requested page could not be found.</p>';
        echo '<a href="' . BASE_URL . '">Go to Home</a>';
        exit;
    }

    /**
     * Admin pages
     */
    public function admin($page = 'index')
    {
        $page = preg_replace('/[^a-zA-Z0-9_-]/', '', $page);

        $adminPages = [
            'index' => 'index.html',
            'login' => 'login.html',
            'products' => 'products.html',
            'add-product' => 'add-product.html',
            'edit-product' => 'edit-product.html',
            'orders' => 'orders.html',
            'accounts' => 'accounts.html',
            'inventory' => 'inventory.html'
        ];

        if (!isset($adminPages[$page])) {
            $this->notFound();
            return;
        }

        $htmlFile = ROOT_PATH . '/Page/admin/' . $adminPages[$page];

        if (file_exists($htmlFile)) {
            header('Content-Type: text/html; charset=UTF-8');
            readfile($htmlFile);
            exit;
        } else {
            $this->notFound();
        }
    }
}
?>